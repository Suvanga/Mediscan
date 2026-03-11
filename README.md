# 🩻 MediScan: Balanced Chest X-Ray Diagnosis AI

[![Python](https://img.shields.io/badge/Python-3.9-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**MediScan** is an end-to-end MLOps project that detects **15 common thoracic diseases** from chest X-rays. Unlike standard models that fail on rare diseases, MediScan introduces a custom **Square-Root Loss Scaling** technique to mitigate extreme class imbalance (e.g., Hernia, which is <0.2% of the dataset).

📄 **[Checkout the project)] https://xrayai.suvanga.com/ 

Research paper will be available soon :)



---

## Key Features

* **Advanced Architecture:** Custom `DenseNet121` fine-tuned on the NIH Chest X-ray dataset (100k+ images).
* **Novel Imbalance Mitigation:** Implements **Square-Root Loss Scaling** instead of standard linear weighting, reducing the "panic signal" for rare classes.
* **Bias Calibration:** Post-training logit adjustment (Bias Subtraction) reduces Hernia False Positive Rates (FPR) from **99% to 1%**.
* **High-Performance Backend:** Asynchronous inference engine built with **FastAPI** and **Uvicorn**.
* **Containerized:** Fully dockerized application ready for cloud deployment (Render/AWS).

---

##  Architecture

The project follows a modular MLOps structure:

```text
MediScan_Project/
│
├── .gitignore               
├── README.md               
│
├── backend/                 
│   ├── app/                
│   │   ├── __init__.py
│   │   ├── main.py          
│   │   ├── config.py        
│   │   ├── model.py         
│   │   ├── services.py    
│   │   └── utils.py         
│   │
│   ├── models/              
│   │   └── mediscan_v1.pth
│   │
│   ├── tests/               
│   │   ├── __init__.py
│   │   └── test_api.py
│   │
│   ├── Dockerfile           
│   └── requirements.txt    
│
└── frontend/
