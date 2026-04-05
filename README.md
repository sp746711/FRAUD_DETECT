## 🧩 System Architecture (3D Flow)

```mermaid
flowchart LR
    A[👤 User Input<br>Transaction Data] --> B[🌐 Frontend UI<br>HTML CSS JS]
    B --> C[⚡ FastAPI Backend<br>API Server]
    C --> D[🧠 ML Model<br>Trained Classifier]
    D --> E[📊 Prediction Engine<br>Fraud / Legit]
    E --> C
    C --> B
    B --> F[📈 Result Display<br>Fraud Status]

    style A fill:#0f2027,color:#fff
    style B fill:#203a43,color:#fff
    style C fill:#2c5364,color:#fff
    style D fill:#1abc9c,color:#000
    style E fill:#16a085,color:#000
    style F fill:#2980b9,color:#fff
