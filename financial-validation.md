# Financial Formula Validation

All formulas verified against standard financial mathematics and cross-checked with Microsoft Excel PMT function.

## 1. Future Value of Goal

```
FV = P × (1 + i)^y
```

**Excel equivalent:** `= P * (1 + i)^y`

| P | i | y | Expected FV | App Output |
|---|---|---|---|---|
| ₹10,00,000 | 6% | 10 | ₹17,90,848 | ✅ ₹17,90,848 |
| ₹5,00,000 | 8% | 5 | ₹7,34,664 | ✅ ₹7,34,664 |

## 2. Monthly SIP (Ordinary Annuity)

```
r = R/12
n = y × 12
PMT = (FV × r) / ((1 + r)^n − 1)
```

**Excel equivalent:** `= PMT(R/12, y*12, 0, -FV)`

| FV | R | y | Expected SIP | App Output |
|---|---|---|---|---|
| ₹17,90,848 | 12% | 10 | ₹8,217 | ✅ ₹8,217 |
| ₹7,34,664 | 10% | 5 | ₹9,524 | ✅ ₹9,524 |

## 3. Edge Cases

| Case | Expected | App Output |
|---|---|---|
| y = 0 | SIP = 0, warning | ✅ |
| R = 0 | SIP = FV/n | ✅ |
| Inflation ≥ Return | Warning shown | ✅ |
| Denominator < EPSILON | Fallback formula | ✅ |
| Negative values | Validation error | ✅ |

## Numeric Stability

`EPSILON = 1e-12` is applied on:
- Monthly rate `r` (treat as 0 if |r| < EPSILON)
- Denominator `(1+r)^n - 1` (use fallback if < EPSILON)
- Final result (return 0 if not finite)
