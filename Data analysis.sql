-- Create the Patients table
CREATE TABLE Patients (
  Patient_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(255) NOT NULL,
  Date_of_Birth DATE NOT NULL,
  Medical_History TEXT
);

-- Create the Providers table
CREATE TABLE Providers (
  Provider_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(255) NOT NULL,
  Specialty VARCHAR(255) NOT NULL,
  Credentials VARCHAR(255) NOT NULL
);

-- Create the Medical_Records table
CREATE TABLE Medical_Records (
  Record_ID INT PRIMARY KEY AUTO_INCREMENT,
  Patient_ID INT NOT NULL,
  Provider_ID INT NOT NULL,
  Diagnosis VARCHAR(255) NOT NULL,
  Treatment TEXT NOT NULL,
  FOREIGN KEY (Patient_ID) REFERENCES Patients(Patient_ID),
  FOREIGN KEY (Provider_ID) REFERENCES Providers(Provider_ID)
);

-- Procedure to insert patient data with validation
DELIMITER //
CREATE PROCEDURE InsertPatient(IN name VARCHAR(255), IN dob DATE, IN medical_history TEXT)
BEGIN
  IF dob > CURRENT_DATE THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Date of birth cannot be in the future';
  END IF;
  INSERT INTO Patients (Name, Date_of_Birth, Medical_History)
  VALUES (name, dob, medical_history);
END //
DELIMITER ;

-- Procedure to insert provider data with validation
DELIMITER //
CREATE PROCEDURE InsertProvider(IN name VARCHAR(255), IN specialty VARCHAR(255), IN credentials VARCHAR(255))
BEGIN
  INSERT INTO Providers (Name, Specialty, Credentials)
  VALUES (name, specialty, credentials);
END //
DELIMITER ;

-- Procedure to insert medical record data with validation
DELIMITER //
CREATE PROCEDURE InsertMedicalRecord(IN patient_id INT, IN provider_id INT, IN diagnosis VARCHAR(255), IN treatment TEXT)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM Patients WHERE Patient_ID = patient_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid patient ID';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM Providers WHERE Provider_ID = provider_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid provider ID';
  END IF;
  INSERT INTO Medical_Records (Patient_ID, Provider_ID, Diagnosis, Treatment)
  VALUES (patient_id, provider_id, diagnosis, treatment);
END //
DELIMITER ;

-- Call the procedures to insert data
CALL InsertPatient('John Doe', '1990-01-01', 'Diabetes');
CALL InsertPatient('Jane Smith', '1985-06-01', 'Hypertension');

CALL InsertProvider('Dr. Smith', 'Cardiology', 'MD');
CALL InsertProvider('Dr. Johnson', 'Primary Care', 'DO');

CALL InsertMedicalRecord(1, 1, 'Diabetic Ketoacidosis', 'Insulin therapy');
CALL InsertMedicalRecord(2, 2, 'Hypertension', 'Lifestyle modifications');

-- Data analysis queries
SELECT 
  COUNT(*) AS total_patients,
  AVG(DATEDIFF(CURRENT_DATE, Date_of_Birth) / 365) AS average_age
FROM Patients;

SELECT 
  Diagnosis, 
  COUNT(*) AS frequency
FROM Medical_Records
GROUP BY Diagnosis
ORDER BY frequency DESC;

SELECT 
  p.Name, 
  COUNT(mr.Record_ID) AS patient_count
FROM Providers p
JOIN Medical_Records mr ON p.Provider_ID = mr.Provider_ID
GROUP BY p.Name
ORDER BY patient_count DESC;

SELECT 
  mr.Treatment, 
  COUNT(mr.Record_ID) AS treatment_count
FROM Medical_Records mr
GROUP BY mr.Treatment
ORDER BY treatment_count DESC;

-- Query the data
SELECT * FROM Patients;
SELECT * FROM Providers;
SELECT * FROM Medical_Records;
