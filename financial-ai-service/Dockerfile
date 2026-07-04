# Use slim Python image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install gunicorn
RUN pip install --upgrade pip \
    && pip install gunicorn

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install torch and whisper with CPU support
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu \
    && pip install numba \
    && pip install openai-whisper --no-deps

RUN mkdir -p /app/whisper_models /app/faiss_db /app/aiData \
    && chmod 777 /app/whisper_models /app/faiss_db /app/aiData


# Copy project files
COPY . .

# Create non-root user
RUN addgroup --system fastapi \
    && adduser --system --ingroup fastapi fastapi \
    && chown -R fastapi:fastapi /app

# Switch to non-root user
USER fastapi


# Expose port
EXPOSE 7000

# Run the application
CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:7000", "--timeout", "1000"]