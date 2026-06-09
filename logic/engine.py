def classify(value_a, value_b, type):
    if type == "cost":
        if value_b < value_a:
            return "Better"
        elif value_b == value_a:
            return "Equivalent"
        else:
            return "Worse"

def assign_severity(classification):
    if classification == "Worse":
        return 3
    elif classification == "Equivalent":
        return 1
    else:
        return 1
``
