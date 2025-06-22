import tkinter as tk
from tkinter import ttk, messagebox

class HealthcareGUI:
    def __init__(self, root):
        self.root = root
        self.root.title('Healthcare Database')
        self.data = []

        # Create data display
        self.data_display = ttk.Treeview(self.root, columns=('Patient_ID', 'Name', 'Age', 'Diagnosis'), show='headings')
        self.data_display.heading('Patient_ID', text='Patient ID')
        self.data_display.heading('Name', text='Name')
        self.data_display.heading('Age', text='Age')
        self.data_display.heading('Diagnosis', text='Diagnosis')
        self.data_display.pack()

        # Create input forms
        self.input_frame = tk.Frame(self.root)
        self.input_frame.pack()
        tk.Label(self.input_frame, text='Patient ID:').pack(side=tk.LEFT)
        self.patient_id_entry = tk.Entry(self.input_frame)
        self.patient_id_entry.pack(side=tk.LEFT)
        tk.Label(self.input_frame, text='Name:').pack(side=tk.LEFT)
        self.name_entry = tk.Entry(self.input_frame)
        self.name_entry.pack(side=tk.LEFT)
        tk.Label(self.input_frame, text='Age:').pack(side=tk.LEFT)
        self.age_entry = tk.Entry(self.input_frame)
        self.age_entry.pack(side=tk.LEFT)
        tk.Label(self.input_frame, text='Diagnosis:').pack(side=tk.LEFT)
        self.diagnosis_entry = tk.Entry(self.input_frame)
        self.diagnosis_entry.pack(side=tk.LEFT)

        # Create buttons
        self.button_frame = tk.Frame(self.root)
        self.button_frame.pack()
        tk.Button(self.button_frame, text='Add', command=self.add_data).pack(side=tk.LEFT)
        tk.Button(self.button_frame, text='Update', command=self.update_data).pack(side=tk.LEFT)
        tk.Button(self.button_frame, text='Delete', command=self.delete_data).pack(side=tk.LEFT)

        # Create search frame
        self.search_frame = tk.Frame(self.root)
        self.search_frame.pack()
        tk.Label(self.search_frame, text='Search by Patient ID:').pack(side=tk.LEFT)
        self.search_entry = tk.Entry(self.search_frame)
        self.search_entry.pack(side=tk.LEFT)
        tk.Button(self.search_frame, text='Search', command=self.search_data).pack(side=tk.LEFT)
        tk.Button(self.search_frame, text='Clear', command=self.clear_search).pack(side=tk.LEFT)

    def add_data(self):
        patient_id = self.patient_id_entry.get()
        name = self.name_entry.get()
        age = self.age_entry.get()
        diagnosis = self.diagnosis_entry.get()
        self.data_display.insert('', 'end', values=(patient_id, name, age, diagnosis))
        self.patient_id_entry.delete(0, tk.END)
        self.name_entry.delete(0, tk.END)
        self.age_entry.delete(0, tk.END)
        self.diagnosis_entry.delete(0, tk.END)

    def update_data(self):
        try:
            selected_item = self.data_display.selection()[0]
            patient_id = self.patient_id_entry.get()
            name = self.name_entry.get()
            age = self.age_entry.get()
            diagnosis = self.diagnosis_entry.get()
            self.data_display.item(selected_item, values=(patient_id, name, age, diagnosis))
            self.patient_id_entry.delete(0, tk.END)
            self.name_entry.delete(0, tk.END)
            self.age_entry.delete(0, tk.END)
            self.diagnosis_entry.delete(0, tk.END)
        except IndexError:
            messagebox.showerror("Error", "Please select a row to update")

    def delete_data(self):
        try:
            selected_item = self.data_display.selection()[0]
            self.data_display.delete(selected_item)
        except IndexError:
            messagebox.showerror("Error", "Please select a row to delete")

    def search_data(self):
        for item in self.data_display.get_children():
            values = self.data_display.item(item, 'values')
            if values[0] == self.search_entry.get():
                self.data_display.selection_set(item)
                self.data_display.focus(item)
                return
        messagebox.showinfo("Search Result", "No matching record found")

    def clear_search(self):
        for item in self.data_display.get_children():
            self.data_display.selection_remove(item)
        self.search_entry.delete(0, tk.END)

root = tk.Tk()
gui = HealthcareGUI(root)
root.mainloop()
