class User:
    def __init__(self, username, department, clearance_level):
        self.username = username
        self.department = department
        self.clearance_level = clearance_level

class Resource:
    def __init__(self, name, department, sensitivity_level):
        self.name = name
        self.department = department
        self.sensitivity_level = sensitivity_level

class AccessControl:
    def __init__(self):
        self.policy = {
            'department_match': lambda user, resource: user.department == resource.department,
            'clearance_level_match': lambda user, resource: user.clearance_level >= resource.sensitivity_level
        }

    def check_access(self, user, resource):
        for rule, func in self.policy.items():
            if not func(user, resource):
                return False
        return True

# Create users
user1 = User('John', 'HR', 3)
user2 = User('Jane', 'Finance', 2)

# Create resources
resource1 = Resource('Employee Data', 'HR', 2)
resource2 = Resource('Financial Reports', 'Finance', 3)

# Create access control instance
access_control = AccessControl()

# Check access
print(access_control.check_access(user1, resource1))  # True
print(access_control.check_access(user2, resource1))  # False
print(access_control.check_access(user1, resource2))  # False
print(access_control.check_access(user2, resource2))  # False
