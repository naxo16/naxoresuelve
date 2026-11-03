FROM python:3.12-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Security: Non-root user (SonarQube docker:S6471)
RUN groupadd -g 1000 appgroup && useradd -u 1000 -g appgroup -m appuser

WORKDIR /app

# Copy dependency files first (cache layer)
COPY pyproject.toml ./

# Install dependencies safely with no-cache (SonarQube docker:S8541)
RUN uv pip install --no-cache --system -r pyproject.toml

# Copy application code
COPY apps/ ./apps/

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
