import React, { useMemo, useState } from "react";

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  hero: {
    background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color: "white",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  heroSubtitle: {
    fontSize: "14px",
    opacity: 0.9,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    border: "1px solid #dbe3ee",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#0f172a",
  },
  sectionLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  field: {
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    background: "white",
  },
  scenarioNote: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "14px",
  },
  riskBox: (severity) => ({
    borderRadius: "16px",
    padding: "20px",
    background:
      severity === 3 ? "#fee2e2" : severity === 2 ? "#fef3c7" : "#dcfce7",
    color: severity === 3 ? "#991b1b" : severity === 2 ? "#92400e" : "#166534",
    border: "1px solid rgba(0,0,0,0.06)",
  }),
  riskScore: {
    fontSize: "42px",
    fontWeight: "700",
    lineHeight: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    padding: "10px",
    fontSize: "13px",
    color: "#475569",
  },
  td: {
    borderBottom: "1px solid #f1f5f9",
    padding: "12px 10px",
    fontSize: "14px",
    verticalAlign: "top",
  },
  pill: (classification) => ({
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    background:
      classification === "Leaner"
        ? "#fee2e2"
        : classification === "Richer"
        ? "#dcfce7"
        : classification === "Unable to Determine"
        ? "#fef3c7"
        : "#e2e8f0",
    color:
      classification === "Leaner"
        ? "#991b1b"
        : classification === "Richer"
        ? "#166534"
        : classification === "Unable to Determine"
        ? "#92400e"
        : "#334155",
  }),
  severityPill: (severity) => ({
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    background:
      severity === 3
        ? "#fee2e2"
        : severity === 2
        ? "#fef3c7"
        : severity === 1
        ? "#dcfce7"
        : "#e2e8f0",
    color:
      severity === 3
        ? "#991b1b"
        : severity === 2
        ? "#92400e"
        : severity === 1
        ? "#166534"
        : "#334155",
  }),
  list: {
    paddingLeft: "18px",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};

const scenarios = [
  {
    name: "PPO Deductible Mismatch",
    description:
      "ABC Company plan has a higher deductible and delayed primary care access.",
    currentPlan: {
      deductible: 1500,
      oopMax: 5500,
      pcpCopay: 30,
      specialistCopay: 60,
      coinsurance: 20,
      pcpTiming: "before deductible",
      deductibleType: "embedded",
    },
    abcPlan: {
      deductible: 2000,
      oopMax: 6000,
      pcpCopay: 30,
      specialistCopay: 60,
      coinsurance: 20,
      pcpTiming: "after deductible",
      deductibleType: "aggregate",
    },
  },
  {
    name: "Richer ABC Company Example",
    description:
      "ABC Company plan has lower costs and earlier access structure.",
    currentPlan: {
      deductible: 2000,
      oopMax: 6000,
      pcpCopay: 40,
      specialistCopay: 70,
      coinsurance: 30,
      pcpTiming: "after deductible",
      deductibleType: "aggregate",
    },
    abcPlan: {
      deductible: 1500,
      oopMax: 5500,
      pcpCopay: 30,
      specialistCopay: 60,
      coinsurance: 20,
      pcpTiming: "before deductible",
      deductibleType: "embedded",
    },
  },
  {
    name: "Equivalent Plan",
    description:
      "Current plan and ABC Company plan are aligned on values and structure.",
    currentPlan: {
      deductible: 1500,
      oopMax: 5500,
      pcpCopay: 30,
      specialistCopay: 60,
      coinsurance: 20,
      pcpTiming: "before deductible",
      deductibleType: "embedded",
    },
    abcPlan: {
      deductible: 1500,
      oopMax: 5500,
      pcpCopay: 30,
      specialistCopay: 60,
      coinsurance: 20,
      pcpTiming: "before deductible",
      deductibleType: "embedded",
    },
  },
];

function classifyLowerBetter(
  currentValue,
  compareValue,
  label = "ABC Company"
) {
  if (
    currentValue === "" ||
    compareValue === "" ||
    Number.isNaN(Number(currentValue)) ||
    Number.isNaN(Number(compareValue))
  ) {
    return {
      classification: "Unable to Determine",
      severity: 0,
      reason: "Missing numeric value.",
    };
  }

  const c = Number(currentValue);
  const a = Number(compareValue);

  if (a < c) {
    return {
      classification: "Richer",
      severity: 1,
      reason: `${label} value is lower, reducing member cost.`,
    };
  }

  if (a === c) {
    return {
      classification: "Equivalent",
      severity: 1,
      reason: "Values match.",
    };
  }

  return {
    classification: "Leaner",
    severity: 3,
    reason: `${label} value is higher, increasing member cost.`,
  };
}

function structuralCheck(label, planA, planB) {
  if (label === "PCP Access") {
    if (planA.pcpTiming !== planB.pcpTiming) {
      if (
        planA.pcpTiming === "before deductible" &&
        planB.pcpTiming === "after deductible"
      ) {
        return {
          classification: "Leaner",
          severity: 3,
          reason: "Access is delayed until deductible is met.",
        };
      }

      if (
        planA.pcpTiming === "after deductible" &&
        planB.pcpTiming === "before deductible"
      ) {
        return {
          classification: "Richer",
          severity: 1,
          reason:
            "Access improves because care is available before deductible.",
        };
      }
    }

    return {
      classification: "Equivalent",
      severity: 1,
      reason: "Primary care access structure matches.",
    };
  }

  if (label === "Deductible Type") {
    if (planA.deductibleType !== planB.deductibleType) {
      if (
        planA.deductibleType === "embedded" &&
        planB.deductibleType === "aggregate"
      ) {
        return {
          classification: "Leaner",
          severity: 2,
          reason:
            "Family deductible structure may delay when plan payment begins.",
        };
      }

      if (
        planA.deductibleType === "aggregate" &&
        planB.deductibleType === "embedded"
      ) {
        return {
          classification: "Richer",
          severity: 1,
          reason:
            "Embedded deductible structure can improve member access to plan payment.",
        };
      }
    }

    return {
      classification: "Equivalent",
      severity: 1,
      reason: "Deductible structure matches.",
    };
  }

  return {
    classification: "Equivalent",
    severity: 1,
    reason: "No structural issue identified.",
  };
}

function severityLabel(severity) {
  const map = {
    3: "Critical",
    2: "Moderate",
    1: "Informational",
    0: "Unknown",
  };
  return map[severity] || "Unknown";
}

function comparePlans(planA, planB) {
  const results = [
    {
      benefit: "Deductible",
      current: `$${planA.deductible}`,
      abc: `$${planB.deductible}`,
      ...classifyLowerBetter(planA.deductible, planB.deductible, "ABC Company"),
    },
    {
      benefit: "Out-of-Pocket Max",
      current: `$${planA.oopMax}`,
      abc: `$${planB.oopMax}`,
      ...classifyLowerBetter(planA.oopMax, planB.oopMax, "ABC Company"),
    },
    {
      benefit: "Primary Care Copay",
      current: `$${planA.pcpCopay}`,
      abc: `$${planB.pcpCopay}`,
      ...classifyLowerBetter(planA.pcpCopay, planB.pcpCopay, "ABC Company"),
    },
    {
      benefit: "Specialist Copay",
      current: `$${planA.specialistCopay}`,
      abc: `$${planB.specialistCopay}`,
      ...classifyLowerBetter(
        planA.specialistCopay,
        planB.specialistCopay,
        "ABC Company"
      ),
    },
    {
      benefit: "Coinsurance",
      current: `${planA.coinsurance}%`,
      abc: `${planB.coinsurance}%`,
      ...classifyLowerBetter(
        planA.coinsurance,
        planB.coinsurance,
        "ABC Company"
      ),
    },
    {
      benefit: "PCP Access",
      current: planA.pcpTiming,
      abc: planB.pcpTiming,
      ...structuralCheck("PCP Access", planA, planB),
    },
    {
      benefit: "Deductible Type",
      current: planA.deductibleType,
      abc: planB.deductibleType,
      ...structuralCheck("Deductible Type", planA, planB),
    },
  ];

  const highestSeverity = Math.max(...results.map((r) => r.severity));

  const findings = [];
  if (results.some((r) => r.classification === "Leaner")) {
    findings.push(
      "Leaner benefits identified that may increase member cost or delay access."
    );
  }
  if (results.some((r) => r.severity === 2)) {
    findings.push(
      "Structural mismatches require review before treating plans as equivalent."
    );
  }
  if (results.some((r) => r.classification === "Richer")) {
    findings.push(
      "Some ABC Company values appear richer based on available data."
    );
  }
  if (results.some((r) => r.severity === 0)) {
    findings.push(
      "Some comparisons could not be completed due to missing data."
    );
  }

  return { results, highestSeverity, findings };
}

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [currentPlan, setCurrentPlan] = useState({
    ...scenarios[0].currentPlan,
  });
  const [abcPlan, setAbcPlan] = useState({
    ...scenarios[0].abcPlan,
  });

  const loadScenario = (index) => {
    setSelectedScenario(index);
    setCurrentPlan({ ...scenarios[index].currentPlan });
    setAbcPlan({ ...scenarios[index].abcPlan });
  };

  const analysis = useMemo(
    () => comparePlans(currentPlan, abcPlan),
    [currentPlan, abcPlan]
  );

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroTitle}>Plan Comparison Demo</div>
        <div style={styles.heroSubtitle}>
          Non-proprietary sample showing comparison logic, classification,
          structural checks, and severity scoring.
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Select Scenario</div>
          <div style={styles.field}>
            <div style={styles.sectionLabel}>Scenario</div>
            <select
              style={styles.select}
              value={selectedScenario}
              onChange={(e) => loadScenario(Number(e.target.value))}
            >
              {scenarios.map((s, i) => (
                <option key={i} value={i}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.scenarioNote}>
            {scenarios[selectedScenario].description}
          </div>
        </div>

        <div style={styles.riskBox(analysis.highestSeverity)}>
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>
            Overall Case Risk
          </div>
          <div style={styles.riskScore}>{analysis.highestSeverity}</div>
          <div style={{ fontWeight: "700", marginTop: "6px" }}>
            {severityLabel(analysis.highestSeverity)}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Plan Comparison (ABC Company)</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Benefit</th>
              <th style={styles.th}>Current Plan</th>
              <th style={styles.th}>ABC Company</th>
              <th style={styles.th}>Classification</th>
              <th style={styles.th}>Severity</th>
              <th style={styles.th}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {analysis.results.map((r) => (
              <tr key={r.benefit}>
                <td style={styles.td}>{r.benefit}</td>
                <td style={styles.td}>{r.current}</td>
                <td style={styles.td}>{r.abc}</td>
                <td style={styles.td}>
                  <span style={styles.pill(r.classification)}>
                    {r.classification}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.severityPill(r.severity)}>
                    {severityLabel(r.severity)}
                  </span>
                </td>
                <td style={styles.td}>{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Key Findings</div>
        <ul style={styles.list}>
          {analysis.findings.length > 0 ? (
            analysis.findings.map((finding, i) => <li key={i}>{finding}</li>)
          ) : (
            <li>No major issues identified in the current scenario.</li>
          )}
        </ul>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>How This Demo Works</div>
        <ul style={styles.list}>
          <li>Compares Current Plan vs ABC Company plan values.</li>
          <li>
            Uses member-cost logic to classify benefits as Richer, Equivalent,
            or Leaner.
          </li>
          <li>
            Checks structural differences like before/after deductible and
            deductible type.
          </li>
          <li>Assigns severity scores to highlight potential risk areas.</li>
        </ul>
      </div>
    </div>
  );
}
