"""Custom template filters for academy_web."""
from django import template

register = template.Library()


@register.filter
def add_value(value, arg):
    """Add a numeric value to another numeric value.
    
    Args:
        value: The base value (e.g., price)
        arg: The value to add
        
    Returns:
        The sum of the two values, or the original value if addition fails
    """
    try:
        return float(value) + float(arg)
    except (ValueError, TypeError):
        return value
