from __future__ import annotations

from django import forms


class CoursePaymentProofForm(forms.Form):
    proof_file = forms.FileField(required=False)
    proof_url = forms.URLField(required=False)
    notes = forms.CharField(required=False, widget=forms.Textarea)

    def clean(self):
        cleaned = super().clean()
        proof_file = cleaned.get("proof_file")
        proof_url = (cleaned.get("proof_url") or "").strip() or None

        if not proof_file and not proof_url:
            raise forms.ValidationError("Upload a file or provide a URL")

        cleaned["proof_url"] = proof_url
        return cleaned
