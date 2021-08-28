FROM docker.io/python:3.9-slim

WORKDIR /opt/app
EXPOSE 80

RUN apt-get update && apt-get install -y curl
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python -
RUN rm -rf /var/lib/apt/lists/*

COPY pyproject.toml poetry.lock .
RUN /root/.local/bin/poetry install

COPY . ./

CMD ["/root/.local/bin/poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
