\# ⚙️ Setup Requirements — Pothole Detection System



Before running this project, make sure you have the following installed on your system.



\---



\## 📥 Required Downloads



| Software | Version | Download |

|----------|---------|----------|

| Python | 3.8 or higher | \[python.org](https://www.python.org/downloads/) |

| Node.js \& npm | v18 or higher | \[nodejs.org](https://nodejs.org/) |

| MongoDB | 7.0 or higher | \[mongodb.com](https://www.mongodb.com/try/download/community) |

| Git | Latest | \[git-scm.com](https://git-scm.com/) |



\---



\## 📦 Python Packages



Install these after setting up the flask\_server:



```bash

pip install flask flask-cors torch torchvision pillow

```



> ⚠️ \*\*torch\*\* (PyTorch) is around 1GB — make sure you have a stable internet connection and enough disk space before installing.



\---



\## 💻 System Requirements



\- \*\*RAM:\*\* 8GB minimum recommended

\- \*\*Storage:\*\* At least 3GB free space

\- \*\*OS:\*\* Windows 10/11, macOS, or Linux



\---



\## ❗ Common Errors \& Fixes



| Error | Fix |

|-------|-----|

| `mongod` not recognized | Add MongoDB bin folder to system PATH |

| `Data directory not found` | Run `mkdir C:\\data\\db` in CMD |

| `model.pth not found` | Make sure you're running `python app.py` from inside the `flask\_server/` folder |

| Port already in use | Restart CMD and try again |

| NaN confidence score (ANN) | Known limitation — use CNN model for more accurate results |



\---



Once everything above is installed, follow the \*\*README.md\*\* for step by step instructions to run the project.



