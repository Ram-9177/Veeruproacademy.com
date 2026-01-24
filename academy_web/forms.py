from __future__ import annotations

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

from academy_users.models import User


class SignupForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput, label="Password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm password")

    class Meta:
        model = User
        fields = ["email", "name"]

    def clean_email(self):
        email = (self.cleaned_data.get("email") or "").strip().lower()
        if not email:
            raise forms.ValidationError("Email is required")
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("An account with this email already exists")
        return email

    def clean(self):
        cleaned = super().clean()
        p1 = cleaned.get("password1")
        p2 = cleaned.get("password2")
        if not p1 or not p2:
            return cleaned
        if p1 != p2:
            self.add_error("password2", "Passwords do not match")
            return cleaned
        validate_password(p1)
        return cleaned

    def save(self, commit: bool = True) -> User:
        user: User = super().save(commit=False)
        user.email = (user.email or "").lower().strip()
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        self.user: User | None = None
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned = super().clean()
        email = (cleaned.get("email") or "").strip().lower()
        password = cleaned.get("password")
        if not email or not password:
            return cleaned

        user = authenticate(email=email, password=password)
        if user is None:
            raise forms.ValidationError("Invalid email or password")
        if not user.is_active:
            raise forms.ValidationError("Account is inactive")
        self.user = user
        return cleaned


class ContactForm(forms.Form):
    """Contact form for user inquiries."""
    name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)
    subject = forms.CharField(max_length=200, required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)

    def clean_message(self):
        message = self.cleaned_data.get("message", "")
        if len(message) < 10:
            raise forms.ValidationError("Message must be at least 10 characters long")
        return message


class PasswordResetRequestForm(forms.Form):
    """Form to request a password reset email."""
    email = forms.EmailField(label="Email address")

    def clean_email(self):
        email = (self.cleaned_data.get("email") or "").strip().lower()
        if not email:
            raise forms.ValidationError("Email is required")
        return email


class PasswordResetConfirmForm(forms.Form):
    """Form to set a new password after reset."""
    password1 = forms.CharField(widget=forms.PasswordInput, label="New password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm new password")

    def clean(self):
        cleaned = super().clean()
        p1 = cleaned.get("password1")
        p2 = cleaned.get("password2")
        if not p1 or not p2:
            return cleaned
        if p1 != p2:
            self.add_error("password2", "Passwords do not match")
            return cleaned
        validate_password(p1)
        return cleaned
