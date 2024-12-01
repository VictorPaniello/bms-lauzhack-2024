import matplotlib.pyplot as plt
import pandas as pd
import torch
import torch.nn as nn
import numpy as np
import torch.optim as optim
import torch.utils.data as data
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.impute import KNNImputer
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import seaborn as sns

def treat_missing_values(df, method):
    if method == 'KNN':

        numeric_columns = df.select_dtypes(include=['number']).columns
        non_numeric_columns = df.select_dtypes(exclude=['number']).columns
        
        imputer = KNNImputer(n_neighbors=2)
        numeric_data = imputer.fit_transform(df[numeric_columns])
        
        numeric_df = pd.DataFrame(numeric_data, columns=numeric_columns)
        correlation_matrix = numeric_df.corr()
        correlation_pairs = correlation_matrix.unstack()

        sorted_pairs = correlation_pairs.abs().sort_values(ascending=False)
        strong_pairs = sorted_pairs[(sorted_pairs < 1.0) & (sorted_pairs > 0.7)]
        print(strong_pairs)

        df = pd.concat([df[non_numeric_columns].reset_index(drop=True), numeric_df], axis=1)
    
    elif method == 'fillna':
        columns_with_missings = df.columns[df.isnull().any()]
        df[columns_with_missings] = df[columns_with_missings].fillna(method='ffill')
        df[columns_with_missings] = df[columns_with_missings].fillna(method='bfill')
      
    return df


def create_dataset(dataset, lookback):
    X, y = [], []
    for i in range(len(dataset) - lookback):
        X.append(dataset[i:i+lookback])
        y.append(dataset[i+lookback])
    return np.array(X), np.array(y)

df = pd.read_csv('public/updated_data.csv')

df = treat_missing_values(df, 'KNN')
#df = treat_missing_values(df, 'fillna')

df.to_csv('public/updated_data.csv', index=False)

# Normalization of the target variable
scaler = MinMaxScaler()
df['volume_factory_sales'] = scaler.fit_transform(df[['volume_factory_sales']])


# LSTM MODEL
lookback = 17
timeseries = df[['volume_factory_sales']].values.astype('float32')
X, y = create_dataset(timeseries, lookback)
X = torch.tensor(X, dtype=torch.float32)
y = torch.tensor(y, dtype=torch.float32)

input_size = X.shape[2]

class LSTMModel(nn.Module):
    def __init__(self, input_size):
        super().__init__()
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=50, num_layers=1, batch_first=True)
        self.linear = nn.Linear(50, 1)

    def forward(self, x):
        x, _ = self.lstm(x)
        x = x[:, -1, :]
        x = self.linear(x)
        return x

model = LSTMModel(input_size=input_size)
optimizer = optim.Adam(model.parameters(), lr=0.001)
loss_fn = nn.MSELoss()

# training lstm
batch_size = 16
num_epochs = 500
loader = data.DataLoader(data.TensorDataset(X, y), shuffle=True, batch_size=batch_size)

for epoch in range(num_epochs):
    model.train()
    for X_batch, y_batch in loader:
        y_pred = model(X_batch)
        loss = loss_fn(y_pred, y_batch.unsqueeze(1))
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    if epoch % 50 == 0:
        print(f'Epoch {epoch}: Loss = {loss.item()}')

forecast_steps = 16
input_sequence = X[-1].unsqueeze(0).clone()
future_predictions = []

model.eval()
with torch.no_grad():
    for _ in range(forecast_steps):
        prediction = model(input_sequence)
        future_predictions.append(prediction.item())

        prediction = prediction.unsqueeze(1)  # to cange from (batch, 1) to (batch, 1, input_size)
        input_sequence = torch.cat((input_sequence[:, 1:, :], prediction), dim=1)

df['Date'] = pd.to_datetime(df['Date'])

if df.index.name != 'Date':
    df.set_index('Date', inplace=True)

# change back to normal values
future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

future_dates = pd.date_range(start=df.index[-1], periods=forecast_steps + 1, freq='ME')[1:]

future_df = pd.DataFrame({
    'Month': future_dates.month,
    'Year': future_dates.year,
    'Prediction': future_predictions.flatten()  # Convertir a 1D para el DataFrame
})


plt.plot(df.index, scaler.inverse_transform(df[['volume_factory_sales']]), label="Historical Data")
plt.plot(future_dates, future_predictions, label="LSTM predictions", linestyle="--")
plt.legend()
#plt.show()

'''ytest_actual = scaler.inverse_transform(np.array(ytest_actual).reshape(-1, 1)).flatten()
ytest_pred = scaler.inverse_transform(np.array(ytest_pred).reshape(-1, 1)).flatten()

# Métricas de evaluación
mae = mean_absolute_error(ytest_actual, ytest_pred)
mse = mean_squared_error(ytest_actual, ytest_pred)
rmse = np.sqrt(mse)
r2 = r2_score(ytest_actual, ytest_pred)

print(f"MAE: {mae:.2f}")
print(f"MSE: {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R2 Score: {r2:.2f}")'''

#EXPONENTIAL SMOOTHING MODEL
ets_model = ExponentialSmoothing(df['volume_factory_sales'], seasonal = 'add', trend = 'add', seasonal_periods = 12).fit()
ets_forecast = ets_model.forecast(16)

#plt.figure(figsize=(12, 6))
plt.plot(df.index,scaler.inverse_transform(df[['volume_factory_sales']]),  label="Historical Data")
plt.plot(future_dates, scaler.inverse_transform(np.array(ets_forecast).reshape(-1, 1)), label="ETS predictions", linestyle="--")
plt.title("ETS predictions")
plt.legend()
#plt.show()

ets_predictions = ets_forecast.values
actual_values = df['volume_factory_sales'][-len(ets_predictions):] 
mae_lstm = mean_absolute_error(actual_values, ets_predictions)
rmse_lstm = np.sqrt(mean_squared_error(actual_values, ets_predictions))
r2_lstm = r2_score(actual_values, ets_predictions)

print(f"MAE (ETS): {mae_lstm:.2f}")
print(f"RMSE (ETS): {rmse_lstm:.2f}")
print(f"R² (ETS): {r2_lstm:.2f}")

results_table = []
results_table.append(
    {"Model": "LSTM", "MAE": mae_lstm, "RMSE": rmse_lstm, "R²": r2_lstm}
)

#ARIMA (optimized)
sarima_model = SARIMAX(df['volume_factory_sales'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12)).fit(disp=False)
sarima_forecast = sarima_model.forecast(steps=16)

plt.plot(df.index, scaler.inverse_transform(df[['volume_factory_sales']]), label="Datos históricos")
plt.plot(future_dates, scaler.inverse_transform(np.array(sarima_forecast.values).reshape(-1, 1)), label="ARIMA predictions", linestyle="--")
plt.title("ARIMA predictions")
plt.legend()
#plt.show()

actual_values_arima = df['volume_factory_sales'][-len(sarima_forecast):]  # Últimos valores reales
sarima_predictions = sarima_forecast.values  # Convertir predicciones a un array si es necesario

mae_arima = mean_absolute_error(actual_values_arima, sarima_predictions)
rmse_arima = np.sqrt(mean_squared_error(actual_values_arima, sarima_predictions))
r2_arima = r2_score(actual_values_arima, sarima_predictions)


print(f"MAE (ARIMA): {mae_arima:.2f}")
print(f"RMSE (ARIMA): {rmse_arima:.2f}")
print(f"R² (ARIMA): {r2_arima:.2f}")

results_table.append(
    {"Model": "ARIMA", "MAE": mae_arima, "RMSE": rmse_arima, "R²": r2_arima}
)

results_table = pd.DataFrame(results_table, columns=['Model', 'MAE', 'RMSE', 'R²'])

print(results_table)

#ARIMA seems to work a bit better than ETS, but they are very similar
future_predictions = scaler.inverse_transform(np.array(sarima_predictions).reshape(-1, 1))

future_dates = pd.date_range(start=df.index[-1], periods=forecast_steps + 1, freq='ME')[1:]
future_df = pd.DataFrame({
    'Month': future_dates.month,
    'Year': future_dates.year,
    'Prediction': future_predictions.flatten()  # Convertir a 1D para el DataFrame
})



future_df.to_csv('public/future_predictions.csv', index=False)
print("Predictions exported to 'future_predictions.csv'")
