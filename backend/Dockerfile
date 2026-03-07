# 1. Use an official, lightweight Python image
FROM python:3.9-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the requirements file and install dependencies
COPY requirements.txt .

# (Optional but recommended) Update pip first
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of your backend code and models into the container
COPY . .

# 5. Tell Docker that this container will talk on port 8000
EXPOSE 8000

# 6. The command that runs when the container starts
# Notice we changed 127.0.0.1 to 0.0.0.0 so AWS can route traffic to it
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


