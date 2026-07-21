{{/*
Validate that persistent storage config is complete.
If persistentStorage is true, the epic-app volume mount config MUST also be present,
otherwise the PVC is created but never mounted (stays Pending forever).
*/}}
{{- if .Values.substrateSandbox.persistentStorage }}
  {{- $epicApp := index .Values "epic-app" }}
  {{- if not $epicApp.volumesFreeForm }}
    {{- fail "\n\nERROR: substrateSandbox.persistentStorage is true but epic-app volume mount config is missing.\n\nAdd these to your values.yaml under epic-app:\n\n  volumesFreeForm: true\n  volumes:\n    - name: sandbox\n      persistentVolumeClaim:\n        claimName: sandbox-pvc\n  podSecurityContext:\n    fsGroup: 1000\n\nAnd under epic-app.containers.service:\n\n      volumes:\n        sandbox: /mount\n\nSee CLAUDE.md 'Persistent Storage' section for full details.\n" }}
  {{- end }}
{{- end }}

{{/*
Validate that ExternalSecrets Vault path matches this app's namespace.
Prevents an app from reading another app's secrets by modifying the Vault key.
*/}}
{{- $epicApp := index .Values "epic-app" }}
{{- if $epicApp.externalSecrets.enabled }}
  {{- range $epicApp.externalSecrets.templated }}
    {{- range .dataFrom }}
      {{- if .extract }}
        {{- $key := .extract.key }}
        {{- $expected := printf "abff-dev-aidevelopment/%s/" $.Release.Name }}
        {{- if not (hasPrefix $expected $key) }}
          {{- fail (printf "\n\nERROR: ExternalSecret Vault path '%s' does not match this app's expected prefix '%s'.\n\nThe Vault key must start with 'abff-dev-aidevelopment/%s/' to prevent cross-app secret access.\n" $key $expected $.Release.Name) }}
        {{- end }}
      {{- end }}
    {{- end }}
  {{- end }}
{{- end }}
