# Chat Prompt History

This file logs all user prompts from this development session for the **SingaRate - Singapore SGD Currency Exchange & Calculator** application.

---

### Prompt 1: Initial App Build
```text
1. build a singapore-based exchange rate tool that provides real-time currency conversion from the SGD against global currencies. 

2. build just the front end for now. I will add the backend integration using MAS API keys later. Use a clean UI with search, favorites, and a simple calculator.
```

---

### Prompt 2: GitHub Repository Push
```text
git push: https://github.com/wilemjake/SGD-CurrencyExchange.git
```
*(Token authenticated push to branch `main` on repository `wilemjake/SGD-CurrencyExchange`)*

---

### Prompt 3: Serverless MAS API Connection
```text
1. add a serverless API connection that pulls live data from MAS API catalogue using the following endpoint:

GET https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily?end_of_day=2026-10-14
# KeyId: <MAS_KEY_ID>

#KeyID: <MAS_KEY_ID>

2. store this in /api folder at the project root level not the src folder. 

3. include a /health.ts and /exchangerates.ts within the same subfolder 

4. do not hardcore any API key, i will manually include them.
```

---

### Prompt 4: Collate Prompts
```text
collate all prompt in this chat under prompt.mdfile
```
