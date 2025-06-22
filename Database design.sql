CREATE TABLE Patients (
  Patient_ID INT PRIMARY KEY,
  Name VARCHAR(255),
  Date_of_Birth DATE,
  Medical_History TEXT
);

CREATE TABLE Providers (
  Provider_ID INT PRIMARY KEY,
  Name VARCHAR(255),
  Specialty VARCHAR(255),
  Credentials VARCHAR(255)
);

CREATE TABLE Medical_Records (
  Record_ID INT PRIMARY KEY,
  Patient_ID INT,
  Provider_ID INT,
  Diagnosis VARCHAR(255),
  Treatment TEXT,
  FOREIGN KEY (Patient_ID) REFERENCES Patients(Patient_ID),
  FOREIGN KEY (Provider_ID) REFERENCES Providers(Provider_ID)
);
INSERT INTO Patients (Patient_ID, Name, Date_of_Birth, Medical_History)
VALUES
  (1, 'John Doe', '1990-01-01', 'Diabetes'),
  (2, 'Jane Smith', '1985-06-01', 'Hypertension'),
  (3, 'Bob Johnson', '1970-03-01', 'Asthma');

INSERT INTO Providers (Provider_ID, Name, Specialty, Credentials)
VALUES
  (1, 'Dr. Smith', 'Cardiology', 'MD'),
  (2, 'Dr. Johnson', 'Primary Care', 'DO'),
  (3, 'Dr. Lee', 'Pulmonology', 'MD');

INSERT INTO Medical_Records (Record_ID, Patient_ID, Provider_ID, Diagnosis, Treatment)
VALUES
  (1, 1, 1, 'Diabetic Ketoacidosis', 'Insulin therapy'),
  (2, 2, 2, 'Hypertension', 'Lifestyle modifications'),
  (3, 3, 3, 'Acute bronchitis', 'Antibiotics');
SELECT * FROM Patients;
SELECT * FROM Providers;
SELECT * FROM Medical_Records;
