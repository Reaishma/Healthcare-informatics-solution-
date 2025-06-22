import plotly.subplots as sp
import plotly.express as px
import pandas as pd
import numpy as np

# Create a sample dataset
data = {
    'Patient_ID': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    'Diagnosis': ['Diabetes', 'Hypertension', 'Diabetes', 'Hypertension', 'Diabetes', 'Hypertension', 'Diabetes', 'Asthma', 'Asthma', 'Diabetes', 'Hypertension', 'Diabetes', 'Asthma', 'Hypertension', 'Diabetes', 'Asthma', 'Diabetes', 'Hypertension', 'Diabetes', 'Asthma'],
    'Treatment': ['Insulin', 'Medication', 'Insulin', 'Medication', 'Insulin', 'Medication', 'Insulin', 'Inhaler', 'Inhaler', 'Insulin', 'Medication', 'Insulin', 'Inhaler', 'Medication', 'Insulin', 'Inhaler', 'Insulin', 'Medication', 'Insulin', 'Inhaler'],
    'Record_Date': ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', '2022-01-05', '2022-01-06', '2022-01-07', '2022-01-08', '2022-01-09', '2022-01-10', '2022-01-11', '2022-01-12', '2022-01-13', '2022-01-14', '2022-01-15', '2022-01-16', '2022-01-17', '2022-01-18', '2022-01-19', '2022-01-20'],
    'Age': np.random.randint(18, 80, 20),
    'Outcome': np.random.choice(['Good', 'Bad'], 20)
}
df = pd.DataFrame(data)

# Create visualizations
fig_scatter = px.scatter(df, x='Age', y='Outcome', color='Diagnosis')
diagnosis_counts = df['Diagnosis'].value_counts().reset_index()
diagnosis_counts.columns = ['Diagnosis', 'Count']
fig_bar = px.bar(diagnosis_counts, x='Diagnosis', y='Count')
diagnosis_treatment_counts = pd.crosstab(df['Diagnosis'], df['Treatment'])
fig_heatmap = px.imshow(diagnosis_treatment_counts, text_auto=True)
treatment_counts = df['Treatment'].value_counts().reset_index()
treatment_counts.columns = ['Treatment', 'Count']
fig_pie = px.pie(treatment_counts, values='Count', names='Treatment')

# Create subplots
fig = sp.make_subplots(rows=2, cols=2, subplot_titles=['Age vs Outcome', 'Distribution of Diagnoses', 'Diagnosis vs Treatment', 'Distribution of Treatments'], specs=[[{"type": "scatter"}, {"type": "bar"}], [{"type": "heatmap"}, {"type": "pie"}]])

fig.add_trace(fig_scatter.data[0], row=1, col=1)
fig.add_trace(fig_bar.data[0], row=1, col=2)
fig.add_trace(fig_heatmap.data[0], row=2, col=1)
fig.add_trace(fig_pie.data[0], row=2, col=2)

fig.update_layout(height=800, width=1200)

fig.show()
