from django import forms

class FeedbackForm(forms.Form):
    message = forms.CharField(widget=forms.Textarea(attrs={"rows": 4, "placeholder": "Your feedback..."}), max_length=1000, label="Feedback")
