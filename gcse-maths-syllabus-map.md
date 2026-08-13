# GCSE Mathematics — Full Teaching & Assessment Map (AQA 8300 · OCR J560)

A complete, spec-derived map of everything the two boards set out to teach, with references, tier,
a worked sample question, its answer, and an authentic mark breakdown for each statement.

Built directly from the primary sources:

- **AQA** — GCSE Mathematics (8300), Specification v1.0, for exams May/June 2017 onwards. Subject content §3.1–3.6, refs N1–N16, A1–A25, R1–R16, G1–G25, P1–P9, S1–S6.
- **OCR** — Cambridge OCR Level 1/Level 2 GCSE (9–1) in Mathematics (J560), Specification v2.0 (May 2026). Content §2b, refs 1.01a–12.03d.
- **AQA** — *Marking guidance: Higher and Foundation tiers, 8300 Mathematics*, v1.0 October 2023.
- **OCR** — J560 published mark schemes (annotations + Subject-Specific Marking Instructions).
- Published past papers and mark schemes from both boards (AQA 8300/1F–3H, OCR J560/01–06).

---

## 1. How to read this document

### 1.1 The `Ref` column is the shared spine

The subject content of GCSE Maths is **set by the Department for Education and is identical across all
exam boards** — AQA states this explicitly ("This content is common to all exam boards"), and OCR
carries a `DfE Ref.` column mapping every one of its statements back to the same codes. So the DfE
reference (`N`umber, `A`lgebra, `R`atio, `G`eometry, `P`robability, `S`tatistics) is used here as the
primary key, with each board's own reference alongside.

**Practical consequence for the platform: content is board-agnostic; only *presentation*,
*question style*, *formula recall* and *paper structure* differ.** A question bank should be authored
against the DfE ref and tagged with board-specific metadata, not duplicated per board.

### 1.2 Tier codes

| Code | Meaning |
|---|---|
| **F** | Basic foundation content (AQA col. 1 / OCR "Initial learning"). Assessed at both tiers. |
| **F+** | Additional foundation content (AQA col. 2 / OCR "Foundation tier learners should also…"). Assessed at both tiers. |
| **H** | Higher tier only (AQA col. 3 / OCR "Higher tier learners should additionally…"). |

Columns are cumulative: a Foundation learner is examined on F and F+; a Higher learner on F, F+ and H.
Where the two boards place a skill in different columns, the row says so.

### 1.3 Assessment structure

| | AQA 8300 | OCR J560 |
|---|---|---|
| Papers | 3 × 1h30 | 3 × 1h30 |
| Marks per paper | 80 (240 total) | 100 (300 total) |
| Non-calculator | Paper 1 | Paper 2 (F) / Paper 5 (H) |
| Calculator | Papers 2 and 3 | Papers 1 & 3 (F) / Papers 4 & 6 (H) |
| Tier codes | 8300/1F–3F, 8300/1H–3H | J560/01–03 (F), J560/04–06 (H) |
| Foundation grades | 1–5 | 1–5 |
| Higher grades | 4–9 | 4–9 |
| Weighting | 33⅓% each paper | 33⅓% each paper |

Any content may appear on any paper at the relevant tier. Both boards state that demand generally
increases through each paper, and both require extended-response questions that sustain a line of
reasoning.

### 1.4 Assessment objectives (identical, set by Ofqual)

| AO | Description | Foundation | Higher |
|---|---|---|---|
| **AO1** | Use and apply standard techniques — recall facts/terminology/definitions, use notation correctly, carry out routine procedures and multi-step solutions | 50% | 40% |
| **AO2** | Reason, interpret and communicate mathematically — deductions, chains of reasoning, arguments and proofs, critically evaluating a given presentation | 25% | 30% |
| **AO3** | Solve problems within maths and in other contexts — translate a context into processes, connect topics, interpret results, evaluate methods and assumptions | 25% | 30% |

AQA quotes these as component ranges (e.g. Higher AO1 30–50% per paper, 40% overall); OCR fixes them
per paper in marks (Higher: 40 / 30 / 30 out of 100).

**Topic-area weightings** (prescribed by Ofqual, common to both boards):

| Topic area | Foundation | Higher |
|---|---|---|
| Number | 25% | 15% |
| Algebra | 20% | 30% |
| Ratio, proportion and rates of change | 25% | 20% |
| Geometry and measures | 15% | 20% |
| Probability and statistics | 15% | 15% |

### 1.5 Mark types — the vocabulary used in the `Marks` column

Both boards use the same three-way scheme. Definitions below are quoted/paraphrased from AQA's
marking guidance and OCR's Subject-Specific Marking Instructions.

| Code | Meaning | Notes |
|---|---|---|
| **M1** | Method mark — "awarded for a correct method which could lead to a correct answer" | OCR: "not lost for purely numerical errors". Awarded for the correct calculation **or** a correct value seen that implies it, anywhere in the response. |
| **M1dep** | Method mark dependent on a previous method mark | AQA: sight of the correct value from the dependent step can imply the earlier mark. |
| **A1** | Accuracy mark — the correct final answer, following on from correct method | OCR: "M0 A1 cannot be awarded". An arithmetic slip loses A but keeps M. |
| **B1 / B2** | Mark awarded independent of method — a stated fact, a measurement, a correct intermediate stage, an explanation | AQA: "awarded independent of method such as for measuring a line, stating a fact… giving explanations or reasons". |
| **ft** | Follow through — credit for correct work after an earlier mistake, so a student is not penalised twice | Written `A1ft` / `B1ft`. OCR marks it `FT`, often "FT their '37'". |
| **SC1 / SC2** | Special case — a common misinterpretation with some mathematical worth | Only when the scheme says so; student gets SC marks **or** method marks, whichever is greater. AQA: SC only counts when it is the final answer. |
| **oe** | Or equivalent | Accept any equivalent form (0.5 for ½, repeated addition for multiplication). |
| **cao** | Correct answer only | No follow through, no equivalents. |
| **soi** | Seen or implied (OCR) | The value need not be the visible method. |
| **isw** | Ignore subsequent working after a correct answer (OCR) | AQA equivalent: "Further work — once the correct answer has been seen, further working may be ignored unless it contradicts". |
| **nfww** | Not from wrong working (OCR) | Correct answer arising from demonstrably wrong method scores 0. |
| **figs** | Any answer with only these digits (OCR) | `figs 237` accepts 2.37, 0.00237, 237000. |
| **[a, b]** | Accept any value in the range, inclusive | AQA also uses `[a, b)` for a ⩽ value < b. |
| **( )** | Bracketed content need not be seen | But if the student writes it, it must be correct. |
| **BOD / MR** | Benefit of doubt / Misread (OCR annotations) | Genuine misread keeps M marks; OCR deducts 1 from A/B marks earned, AQA penalises A/B up to a max of 2. |

### 1.6 Marking principles the generator and auto-marker must implement

These are the behaviours that make a mark scheme *work*, drawn from both boards' guidance. Anything
generating or marking questions on this platform needs them:

1. **Method survives arithmetic error.** A correct calculation shown earns M even if the student
   evaluates it wrongly. Schemes signal this with "their" (`150 × their 0.47`).
2. **A correct value seen anywhere implies the method.** It does not have to sit in the working line —
   it can even be the final answer.
3. **A bare correct answer scores full marks** unless the question says "show that…", "you must show
   your working", or the scheme says `cao`/`nfww`.
4. **Correct answer from demonstrably incorrect working scores nothing** — but only when it is *clear*.
   Where there's doubt, benefit of the doubt goes to the student.
5. **Choice.** If two opposing methods are offered, mark the one leading to the answer on the answer
   line. If no answer is given, AQA marks both and awards the lower; OCR marks the poorest.
6. **Crossed-out work.** Fully crossed out with nothing else → still mark it. Crossed out and
   *replaced* → mark only the replacement.
7. **Premature approximation** is penalised 1 mark (AQA) unless instructed otherwise; students should
   not round intermediate steps.
8. **Accuracy.** OCR marks at the greatest number of significant figures seen, even if the answer line
   is rounded/truncated, unless a specific accuracy is demanded.
9. **Probability answers** may be fraction, decimal or percentage. Once correct, a botched
   simplification is ignored — **except** conversion to a ratio, which scores 0.
10. **Extended/"banded" questions** (typically 5–6 marks) are marked by strategy: marks are attached to
    identifiable stages of the chain of reasoning, with the final A1 reserved for the complete result.

### 1.7 Formulae: the one substantive difference between the boards

Neither board provides a formula sheet in the exam.

- **AQA** splits formulae three ways in its Appendix: (1) must be memorised — quadratic formula,
  circumference and area of a circle, Pythagoras, the three trig ratios, sine rule, cosine rule,
  area = ½ab sin C; (2) must be known **or derivable** — area of a trapezium, volume of a prism,
  compound interest, P(A or B) = P(A) + P(B) − P(A and B), P(A and B) = P(A given B) × P(B);
  (3) **given in the question** — curved surface area of a cone (πrl), surface area of a sphere (4πr²),
  volume of a sphere (⁴⁄₃πr³), volume of a cone (⅓πr²h), and the kinematics formulae.
- **OCR** lists everything that must be recalled in one place, statement **6.02d**, and states "All
  other formulae required will be given in the assessment." OCR's recall list matches AQA's group (1).
  OCR additionally has **6.02e**, requiring Higher learners to *use* the kinematics formulae
  (v = u + at, s = ut + ½at², v² = u² + 2as), with the note "[Knowledge of the definition of each letter
  will not be required.]" — added in spec v1.7, April 2025.

**Platform implication:** the "formula given / formula recalled" flag is board-dependent and must be a
property of the question at render time, not of the topic.

### 1.8 Notable presentational differences

| | AQA | OCR |
|---|---|---|
| Content granularity | 97 statements, prose columns | 147 statements, finer-grained, with worked exemplars in the spec itself |
| Circle theorems | One statement (G10) listing all eight | Eight separate statements (8.05b–8.05h), each phrased "Apply **and prove**" |
| Sketch vs plot | Not formally defined | Formally distinguished in §2b — a *sketch* is freehand, unscaled, correct quadrants/long-term behaviour; a *plot* is on graph paper from calculated coordinates |
| Data misrepresentation | Implicit within S4 | Explicit statement 12.03b (misleading scales/labels) |
| Outliers | Within S4 ("consideration of outliers") | Explicit statement 12.03d, progressing to outliers on scatter graphs |
| Grade descriptors | — | Appendix 5a |

---

## 2. Number (N1–N16)

Foundation weighting 25% · Higher weighting 15%. AQA §3.1 · OCR sections 1–4.

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **N1** | Ordering numbers and inequality symbols | Order positive and negative integers, decimals and fractions; use =, ≠, <, >, ⩽, ⩾, including on a number line | N1 | 2.04a, 2.04b | F | Write these numbers in order, smallest first: −3, 0.5, −½, 2, −2.7 | −3, −2.7, −½, 0.5, 2 | **B1** (1 mark) all five correct, cao. Reversed order scores B0. |
| **N2** | The four operations | Apply the four operations, including formal written methods, to integers, decimals, simple proper/improper fractions and mixed numbers, positive and negative; understand and use place value. Includes household-finance vocabulary: profit, loss, cost price, selling price, debit, credit, balance, income tax, VAT, interest rate | N2 | 1.01a, 2.01b, 2.02a–c | F | A shop buys 24 mugs for £3.40 each and sells them all for £5.99 each. Work out the profit. | £62.16 | **M1** 24 × 3.40 or 81.6(0) · **M1** 24 × 5.99 or 143.76 · **M1dep** their 143.76 − their 81.6(0) · **A1** 62.16 oe (accept £62.16). Correct answer with no working scores 4. |
| **N3** | Inverse operations and order of operations | Relationships between operations including inverses (cancellation to simplify); conventional priority of operations — brackets, powers, roots, reciprocals | N3 | 1.03a, 1.04a, 2.01a | F | Work out 5 + 3 × (8 − 6)² | 17 | **M1** (8 − 6)² = 4 or 3 × 4 = 12 soi · **A1** 17 cao. Answer 68 (left-to-right) scores M0A0. |
| **N4** | Primes, factors, multiples, HCF/LCM | Vocabulary of primes, factors (divisors), multiples, common factors, common multiples, HCF, LCM, prime factorisation including product notation and the unique factorisation theorem | N4 | 1.02a–c | F, F+ | (a) Write 84 as a product of its prime factors in index form. (b) Find the HCF of 84 and 90. | (a) 2² × 3 × 7 (b) 6 | (a) **B2** 2² × 3 × 7 isw; **B1** for a correct factor tree or an answer one step away (e.g. 2 × 2 × 3 × 7 accepted for B2; 2 × 42 only B1). (b) **M1** 90 = 2 × 3² × 5 soi or listing common factors · **A1** 6 cao. |
| **N5** | Systematic listing | Apply systematic listing strategies using lists, tables and diagrams; **H:** the product rule for counting | N5 | 11.02a, 11.02b | F+, H | A code is made from one letter (A, B or C) followed by two different digits chosen from 1–5. How many codes are possible? | 60 | **M1** 5 × 4 or 20 soi · **M1dep** their 20 × 3 · **A1** 60 cao. SC1 for 75 (digits allowed to repeat). |
| **N6** | Powers and roots | Positive integer powers and associated real roots (square, cube, higher); recognise powers of 2, 3, 4, 5; square numbers to 15 × 15; know 1000 = 10³ and 1 million = 10⁶. **F+:** estimate powers and roots of any positive number | N6 | 1.02a, 1.04a, 3.01a, 3.01b | F, F+ | Estimate √72, giving your answer to 1 decimal place, and explain your reasoning. | ≈ 8.5 (accept [8.4, 8.5]) | **M1** 8² = 64 and 9² = 81 soi, or identifies 72 lies between them · **A1** any value in [8.4, 8.5] with reasoning. Answer alone without reasoning: M0A1 is not available — this is a "show your reasoning" question, so **B1** only for a bare correct value. |
| **N7** | Calculating with roots and indices | Calculate with roots and with integer indices. **H:** fractional indices | N7 | 3.01a–c | F+, H | Work out 16^(3/4) | 8 | **M1** ⁴√16 = 2 soi or 16^(3/4) = (⁴√16)³ · **A1** 8 cao. (Higher only.) |
| **N8** | Exact calculation and surds | Calculate exactly with fractions. **F+:** exactly with multiples of π. **H:** calculate exactly with surds, simplify surd expressions involving squares (e.g. √12 = √4×√3 = 2√3) and rationalise denominators | N8 | 2.01b, 3.03a, 3.03b | F, F+, H | Simplify fully (a) √50 (b) 6/√3 | (a) 5√2 (b) 2√3 | (a) **M1** √25 × √2 oe soi · **A1** 5√2 cao. (b) **M1** 6√3/3 oe (multiplying by √3/√3) · **A1** 2√3 cao. (Higher only.) |
| **N9** | Standard form | Calculate with and interpret standard form A × 10ⁿ where 1 ⩽ A < 10 and n is an integer, with and without a calculator; interpret calculator displays | N9 | 3.02a, 3.02b | F+ | Work out (3.2 × 10⁵) × (4 × 10⁻²). Give your answer in standard form. | 1.28 × 10⁴ | **M1** 3.2 × 4 = 12.8 or 10⁵ × 10⁻² = 10³ soi · **M1dep** 12.8 × 10³ oe · **A1** 1.28 × 10⁴ cao. Answer 12.8 × 10³ scores M1M1A0 (not in standard form). |
| **N10** | Terminating decimals and fractions | Work interchangeably with terminating decimals and their corresponding fractions (3.5 and 7/2, 0.375 and 3/8), including ordering. **H:** convert recurring decimals to fractions and vice versa | N10 | 2.02a | F, H | Prove that 0.4̇5̇ = 5/11 | Shown | **M1** x = 0.454545… and 100x = 45.454545… · **M1dep** 99x = 45 · **A1** x = 45/99 = 5/11 with full working. "Show that" — no working, no marks. (Higher only.) |
| **N11** | Fractions in ratio problems | Identify and work with fractions in ratio problems | N11 | 5.01c | F+ | In a class, 3/8 of the students are left-handed. Write the ratio of left-handed to right-handed students in its simplest form. | 3 : 5 | **M1** 5/8 right-handed soi · **A1** 3 : 5 cao (accept 3 to 5). |
| **N12** | Fractions and percentages as operators | Interpret fractions and percentages as operators, including percentage problems via a multiplier | N12 | 2.01c, 2.03b, 2.03c | F | Work out 35% of 240 | 84 | **M1** 0.35 × 240 oe, or 24 + 48 + 12, or 10% = 24 soi · **A1** 84 cao. |
| **N13** | Standard units and compound measures | Use standard units of mass, length, time, money and other measures, including standard compound measures, with decimals where appropriate; know and use metric conversion factors for length, area, volume and capacity. Imperial/metric conversions are given in the question | N13 | 10.01a, 10.01b | F | A rectangle measures 2.5 m by 40 cm. Work out its area in cm². | 10 000 cm² | **M1** 2.5 m = 250 cm soi · **M1dep** 250 × 40 · **A1** 10 000 cao with units cm². SC1 for 1 m² (correct area, wrong unit conversion). |
| **N14** | Estimation and checking | Estimate answers; check calculations using approximation and estimation, including answers obtained using technology, and evaluate the results | N14 | 4.01b | F | Estimate the value of (48.7 × 6.1) / 0.48 | ≈ 600 | **M1** two of 50, 6, 0.5 seen soi · **M1dep** 50 × 6 ÷ 0.5 oe · **A1** 600. Accept a fully correct method to any sensible rounding; do **not** accept the exact value 618.5… (this is an estimation question). |
| **N15** | Rounding and error intervals | Round numbers and measures to a specified number of decimal places or significant figures, with appropriate rounding in context; do not round during intermediate steps. **F+:** use inequality notation to specify simple error intervals due to truncation or rounding | N15 | 4.01a, 4.01c | F, F+ | The length L of a rod is 24 cm to the nearest cm. Write down the error interval for L. | 23.5 ⩽ L < 24.5 | **B1** 23.5 seen · **B1** 24.5 seen · **B1** fully correct inequality with strict/non-strict signs the right way round. Answer 23.5 ⩽ L ⩽ 24.5 scores B1B1B0. |
| **N16** | Limits of accuracy — bounds | **H:** Apply and interpret limits of accuracy, including upper and lower bounds | N16 | 4.01c | H | a = 6.4 and b = 2.1, both correct to 1 d.p. Calculate the upper bound of a ÷ b. Give your answer to 3 s.f. | 3.15 | **M1** 6.45 and 2.05 identified soi · **M1dep** 6.45 ÷ 2.05 (upper ÷ lower) · **A1** 3.15 cao (accept 3.1463… rot). Using 6.45 ÷ 2.15 scores M1M0A0. (Higher only.) |

---

## 3. Algebra (A1–A25)

Foundation weighting 20% · Higher weighting 30%. AQA §3.2 · OCR sections 6–7.

### 3.1 Notation, vocabulary and manipulation

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **A1** | Algebraic notation | Use and interpret algebraic notation: ab for a × b; 3y for y + y + y; a², a³, a²b; a/b for a ÷ b; coefficients written as fractions not decimals; brackets. Answers are expected in simplest form without being told | A1 | 6.01b, 6.01c, 6.01d, 6.01e, 6.01g | F | Simplify 4a + 7b − a + 2b | 3a + 9b | **B2** fully correct; **B1** for 3a or 9b seen. Accept 9b + 3a. |
| **A2** | Substitution | Substitute numerical values into formulae and expressions, including scientific formulae. Unfamiliar formulae are given in the question | A2 | 6.02b, 6.02d, 6.02e | F | v = u + at. Work out v when u = 12, a = −3 and t = 5. | −3 | **M1** 12 + (−3) × 5 oe soi · **A1** −3 cao. Answer 45 (from (12 − 3) × 5) scores M0A0. |
| **A3** | Vocabulary of expressions, equations, formulae, inequalities, terms and factors | Understand and use the concepts and vocabulary; **F+:** to include identities. Assessed implicitly and explicitly | A3 | 6.01a, 6.01b, 6.01d, 6.01e, 6.02a, 6.02d, 6.03a, 6.04a | F, F+ | 3x + 5 = 14, A = πr², 2(x + 3) ≡ 2x + 6, 4y − 1. Which one is an identity? | 2(x + 3) ≡ 2x + 6 | **B1** cao. |
| **A4** | Simplifying and manipulating expressions | Collect like terms; multiply a single term over a bracket; take out common factors; simplify sums, products and powers including the laws of indices. **F+:** expand products of two binomials; factorise x² + bx + c including the difference of two squares; expressions involving surds. **H:** expand products of two or more binomials; factorise ax² + bx + c; algebraic fractions | A4 | 6.01b–6.01g, 6.02c, 3.01c | F, F+, H | (a) Expand and simplify (x + 3)(x − 5). (b) Factorise fully 6x² − 15x. (c) Factorise 2x² + 7x + 3. | (a) x² − 2x − 15 (b) 3x(2x − 5) (c) (2x + 1)(x + 3) | (a) **M1** three of x², −5x, +3x, −15 correct · **A1** x² − 2x − 15 cao. (b) **B2** fully correct; **B1** for 3(2x² − 5x) or x(6x − 15). (c) **M1** (2x + a)(x + b) with ab = 3, or splitting 7x = 6x + x · **A1** cao (Higher). |
| **A5** | Standard formulae and rearranging | Understand and use standard mathematical formulae, including formulae from other subjects in words and symbols. **F+:** rearrange formulae to change the subject | A5 | 6.02a–6.02e | F, F+ | Make r the subject of C = 2πr | r = C/(2π) | **M1** dividing both sides by 2π oe (or by 2 then π) · **A1** r = C/(2π) oe cao. |
| **A6** | Equations vs identities; algebraic argument | Know the difference between an equation and an identity. **F+:** argue mathematically to show expressions are equivalent and use algebra to support and construct arguments. **H:** to include proofs | A6 | 6.01a | F, F+, H | Prove that the sum of any three consecutive integers is a multiple of 3. | Shown | **M1** three consecutive integers expressed algebraically, e.g. n, n + 1, n + 2 · **M1dep** sum = 3n + 3 · **A1** = 3(n + 1) with a conclusion referring to a multiple of 3. AO2 — a numerical demonstration (e.g. 4 + 5 + 6 = 15) scores 0. |
| **A7** | Functions | Where appropriate, interpret simple expressions as functions with inputs and outputs. **F+:** the reverse process as the inverse function. **H:** the succession of two functions as a composite function; f(x), fg(x), f⁻¹(x) notation expected at Higher | A7 | 6.05a | F, F+, H | f(x) = 3x − 1 and g(x) = x². Work out fg(4). | 47 | **M1** g(4) = 16 soi · **A1** 47 cao. gf(4) = 121 scores M0A0. (Higher only.) |

### 3.2 Graphs

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **A8** | Coordinates | Work with coordinates in all four quadrants | A8 | 7.01a, 8.01g | F | A is (−3, 2) and B is (5, −4). Find the midpoint of AB. | (1, −1) | **M1** (−3 + 5)/2 or (2 + −4)/2 soi · **A1** (1, −1) cao. |
| **A9** | Straight-line graphs and their equations | Plot graphs of equations corresponding to straight lines. **F+:** use y = mx + c to identify parallel lines; find the equation of the line through two points, or through one point with a given gradient. **H:** use y = mx + c to identify perpendicular lines | A9 | 7.01b, 7.02a, 7.02b | F, F+, H | Find the equation of the line through (1, 5) and (3, 11). | y = 3x + 2 | **M1** gradient (11 − 5)/(3 − 1) or 3 soi · **M1dep** substituting a point into y = their 3x + c · **A1** y = 3x + 2 oe cao. |
| **A10** | Gradients and intercepts | Identify and interpret gradients and intercepts of linear functions, graphically and algebraically | A10 | 7.02a | F+ | Write down the gradient and the y-intercept of 2y = 6x − 8 | gradient 3, intercept (0, −4) | **M1** y = 3x − 4 seen · **A1** gradient 3 · **A1** −4 oe. Giving 6 and −8 scores M0A0A0. |
| **A11** | Quadratic graphs — roots, intercepts, turning points | Identify and interpret roots, intercepts and turning points of quadratic functions graphically, including the symmetrical property. **F+:** deduce roots algebraically. **H:** deduce turning points by completing the square | A11 | 6.01f, 6.03d, 7.01c | F, F+, H | By completing the square, find the coordinates of the turning point of y = x² − 6x + 11 | (3, 2) | **M1** (x − 3)² seen · **M1dep** (x − 3)² + 2 · **A1** (3, 2) cao. Answer (−3, 2) scores M1M1A0. (Higher only.) |
| **A12** | Recognising and sketching function graphs | Recognise, sketch and interpret graphs of linear and quadratic functions. **F+:** simple cubics and the reciprocal function y = 1/x (x ≠ 0). **H:** exponential functions y = kˣ for positive k, and y = sin x, y = cos x, y = tan x for angles of any size | A12 | 7.01c, 7.01d, 7.01e | F, F+, H | Sketch the graph of y = 2ˣ for −2 ⩽ x ⩽ 3, labelling the y-intercept. | Increasing exponential curve through (0, 1), approaching the x-axis as x decreases | **B1** correct shape in the correct quadrants with correct long-term behaviour · **B1** (0, 1) labelled. OCR: a *sketch* is freehand and need not be to scale, but must interact with the axes correctly. (Higher only.) |
| **A13** | Transformations of functions | **H:** Sketch translations and reflections of a given function | A13 | 7.03a | H | The graph of y = f(x) has a minimum at (2, −5). State the coordinates of the minimum of y = f(x) + 3 | (2, −2) | **B1** cao. (Higher only.) |
| **A14** | Real-context and non-standard graphs | Plot and interpret graphs, and graphs of non-standard functions, in real contexts to find approximate solutions — including simple kinematics involving distance, speed and acceleration. **F+:** reciprocal graphs. **H:** exponential graphs | A14 | 7.01b, 7.04a, 7.04b | F, F+, H | A distance–time graph shows a journey of 30 km in 45 minutes. Work out the average speed in km/h. | 40 km/h | **M1** 45 min = 0.75 h soi · **M1dep** 30 ÷ their 0.75 · **A1** 40 with units km/h. Answer 0.67 (km/min) scores M1M0A0. |
| **A15** | Gradients of and areas under graphs | **H:** Calculate or estimate gradients of graphs and areas under graphs, including quadratic and other non-linear graphs, and interpret the results — distance–time, velocity–time, and financial contexts | A15 | 7.04b, 7.04c | H | A velocity–time graph rises linearly from 0 to 12 m/s over 5 s, then is constant at 12 m/s for 10 s. Estimate the total distance travelled. | 150 m | **M1** ½ × 5 × 12 or 30 soi · **M1** 10 × 12 or 120 soi · **A1** 150 with units m. Interpreting the gradient instead of the area scores 0. (Higher only.) |
| **A16** | Circles and tangents | **H:** Recognise and use the equation of a circle with centre at the origin; find the equation of a tangent to a circle at a given point | A16 | 7.01f, 7.02b | H | The circle x² + y² = 25 passes through P(3, 4). Find the equation of the tangent at P. | y = −¾x + 25/4 | **M1** gradient of radius = 4/3 soi · **M1dep** gradient of tangent = −3/4 (negative reciprocal) · **M1dep** substituting (3, 4) into y = −¾x + c · **A1** y = −¾x + 25/4 oe (accept 3x + 4y = 25). (Higher only.) |

### 3.3 Solving equations and inequalities

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **A17** | Linear equations | Solve linear equations in one unknown algebraically, including brackets. **F+:** with the unknown on both sides; find approximate solutions using a graph | A17 | 6.03a, 6.03d | F, F+ | Solve 5(x − 2) = 3x + 8 | x = 9 | **M1** 5x − 10 seen (correct expansion) · **M1dep** 5x − 3x = 8 + 10 oe (collecting terms correctly) · **A1** 9 cao. Answer 9 with no working scores 3 (no "show your working" instruction). |
| **A18** | Quadratic equations | Solve quadratic equations algebraically by factorising. **F+:** including those requiring rearrangement; approximate solutions from a graph. **H:** by completing the square and by using the quadratic formula | A18 | 6.01f, 6.03b, 6.03d | F, F+, H | Solve 2x² − 5x − 4 = 0. Give your answers to 2 d.p. | x = 3.14 or x = −0.64 | **M1** correct substitution into the quadratic formula: (5 ± √(25 + 32))/4 · **M1dep** √57 or 7.549… soi · **A1** 3.14 · **A1** −0.64. Both to 2 d.p. as demanded; only one root correct scores 3. The quadratic formula must be recalled at Higher on **both** boards (AQA Appendix group 1, OCR 6.02d). |
| **A19** | Simultaneous equations | Solve two simultaneous equations in two variables (linear/linear) algebraically. **F+:** approximate solutions from a graph. **H:** including linear/quadratic | A19 | 6.03c, 6.03d | F, F+, H | Solve simultaneously: 3x + 2y = 19 and x − 2y = 1 | x = 5, y = 2 | **M1** a correct method to eliminate one variable (adding to give 4x = 20, or full substitution) · **A1** x = 5 · **A1ft** y = 2, ft their x correctly substituted. OCR: trial-and-improvement typically scores 0 or full only. |
| **A20** | Iteration | **H:** Find approximate solutions to equations numerically using iteration, including suffix notation in recursive formulae | A20 | 6.03e | H | x(n+1) = √(5x(n) + 2), x₀ = 3. Work out x₂ to 3 d.p. | 4.756 | **M1** x₁ = √17 or 4.123… soi · **M1dep** √(5 × their 4.123 + 2) · **A1** 4.756 cao (accept 4.7555… rot). Premature rounding of x₁ (e.g. to 4.1) that changes the answer: penalise 1 mark. (Higher only.) |
| **A21** | Translating situations into algebra | Translate simple situations or procedures into algebraic expressions or formulae. **F+:** derive an equation (or two simultaneous equations), solve, and interpret the solution — including geometrical problems and problems in context | A21 | 6.02a, 6.03a, 6.03c | F, F+ | 7 rulers and 15 crayons cost £7.00. A ruler costs 12p more than a crayon. Find the cost of a crayon. | 28p (£0.28) | **B1** 7r + 15c = 700 or r = c + 12 · **M1** 7(c + 12) + 15c = 700 oe · **M1** 7c + 84 + 15c = 700 (removing brackets) · **M1** 22c = 700 − 84 (rearranging) · **A1** 28 or £0.28. Allow any pair of letters; allow working in pence or pounds. Trial and improvement scores 0 or 5 only. *(Adapted from OCR J560/04.)* |
| **A22** | Inequalities | Solve linear inequalities in one variable and represent the solution set on a number line (open circle = strict, closed = included). **H:** linear inequalities in one or two variables and quadratic inequalities in one variable; represent solutions on a number line, in set notation and on a graph (dashed line = strict, solid = included) | A22 | 6.04a, 6.04b, 7.02a | F+, H | Solve 4x − 3 ⩾ 9 and show the solution set on a number line. | x ⩾ 3 | **M1** 4x ⩾ 12 soi · **A1** x ⩾ 3 · **B1ft** correct representation with a **closed** circle at their 3 and an arrow to the right. An open circle scores B0. |

### 3.4 Sequences

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **A23** | Generating sequences | Generate terms of a sequence from a term-to-term or a position-to-term rule, including from patterns and diagrams | A23 | 6.06a | F | The nth term of a sequence is 4n − 1. Write down the first three terms. | 3, 7, 11 | **B2** all three correct; **B1** any two correct. |
| **A24** | Special sequences | Recognise and use sequences of triangular, square and cube numbers and simple arithmetic progressions. **F+:** Fibonacci-type sequences, quadratic sequences and simple geometric progressions rⁿ (n integer, r a positive rational). **H:** other sequences, including where r is a surd. Other recursive sequences are defined in the question | A24 | 6.06b | F, F+, H | Here is a Fibonacci-type sequence: 2, 5, 7, 12, … Write down the next two terms. | 19, 31 | **B1** 19 · **B1ft** 31, ft their 12 + their 19. |
| **A25** | nth term | Deduce expressions to calculate the nth term of linear sequences. **H:** including quadratic sequences | A25 | 6.06a | F+, H | Find the nth term of 3, 8, 15, 24, 35, … | n² + 2n | **M1** second difference = 2, so n² term soi · **M1dep** subtracting n²: 2, 4, 6, 8, 10 → 2n · **A1** n² + 2n cao. (Higher only.) |

---

## 4. Ratio, proportion and rates of change (R1–R16)

Foundation weighting 25% · Higher weighting 20%. AQA §3.3 · OCR section 5 (plus 2.03, 10.01).
This is the **largest strand at Foundation tier** and the biggest source of AO3 problem-solving marks.

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **R1** | Converting units, including compound units | Change freely between related standard units (time, length, area, volume/capacity, mass) and compound units (speed, rates of pay, prices) in numerical contexts. **F+:** density, pressure. **H:** in numerical **and algebraic** contexts | R1 | 10.01a, 10.01b | F, F+, H | A car travels at 90 km/h. Convert this to metres per second. | 25 m/s | **M1** 90 × 1000 or 90 000 soi · **M1dep** their 90 000 ÷ 3600 · **A1** 25 with units m/s. |
| **R2** | Scale factors, scale diagrams and maps | Use scale factors, scale diagrams and maps, including geometrical problems | R2 | 9.04b, 10.01c | F | A map has scale 1 : 25 000. Two towns are 8 cm apart on the map. How far apart are they in km? | 2 km | **M1** 8 × 25 000 or 200 000 (cm) soi · **A1** 2 km cao. Answer 200 000 cm without conversion: M1A0. |
| **R3** | One quantity as a fraction of another | Express one quantity as a fraction of another, where the fraction is less than 1 or greater than 1 | R3 | 2.01c | F | Write 35 minutes as a fraction of 2 hours, in its simplest form. | 7/24 | **M1** 35/120 oe soi · **A1** 7/24 cao. |
| **R4** | Ratio notation | Use ratio notation, including reduction to simplest form | R4 | 5.01a | F | Write 24 : 36 : 60 in its simplest form. | 2 : 3 : 5 | **B1** cao. |
| **R5** | Dividing in a ratio | Divide a given quantity into two parts in a given part : part or part : whole ratio; express the division of a quantity into two parts as a ratio; apply ratio to real contexts — conversion, comparison, scaling, mixing, concentrations, including best-buy problems | R5 | 5.01a, 5.01b, 5.01d | F, F+ | £450 is shared between Ann and Ben in the ratio 4 : 5. How much more does Ben get than Ann? | £50 | **M1** 4 + 5 or 9 parts soi · **M1** 450 ÷ their 9 or 50 · **M1dep** their 50 × (5 − 4) oe, or 250 − 200 · **A1** 50 or £50. SC2 for answers of 200 and 250 given without the difference. |
| **R6** | Multiplicative relationships | Express a multiplicative relationship between two quantities as a ratio or a fraction | R6 | 5.01b, 5.01c, 2.01c | F | y is 3/5 of x. Write x : y in its simplest form. | 5 : 3 | **B1** cao. |
| **R7** | Proportion as equality of ratios | Understand and use proportion as equality of ratios | R7 | 5.02a | F | 6 identical pens cost £4.50. Work out the cost of 10 pens. | £7.50 | **M1** 4.50 ÷ 6 or 0.75 soi (unitary method), or 4.50 × 10/6 · **A1** 7.50 or £7.50 cao. |
| **R8** | Ratios, fractions and linear functions | Relate ratios to fractions and to linear functions | R8 | 5.01c, 5.01d, 7.04b | F+ | The ratio of x : y is 2 : 7. Write y as a function of x. | y = 3.5x | **M1** y/x = 7/2 oe soi · **A1** y = 3.5x oe (accept y = 7x/2). |
| **R9** | Percentages | Define percentage as "number of parts per hundred"; interpret percentages and percentage changes as a fraction or decimal, and interpret these multiplicatively; express one quantity as a percentage of another; compare two quantities using percentages; work with percentages greater than 100%; solve problems involving percentage change — increase/decrease, **original value (reverse percentage)** problems, and simple interest in financial maths | R9 | 2.03a, 2.03b, 2.03c, 5.03a | F, F+ | In a sale, all prices are reduced by 15%. A coat costs £68 in the sale. Work out the original price. | £80 | **M1** 0.85 soi as the multiplier, or 68 represents 85% · **M1dep** 68 ÷ their 0.85 oe · **A1** 80 or £80 cao. **SC1** for 78.2 (adding 15% instead of reversing) — a very common error worth tracking as a misconception in the platform. |
| **R10** | Direct and inverse proportion problems | Solve problems involving direct and inverse proportion, including graphical and algebraic representations | R10 | 5.02a, 5.02b, 6.02a, 7.04a | F+ | 5 workers build a wall in 12 days. How long would 3 workers take, working at the same rate? | 20 days | **M1** 5 × 12 or 60 (worker-days) soi · **M1dep** their 60 ÷ 3 · **A1** 20 days. Treating it as direct proportion (12 × 3/5 = 7.2) scores 0. |
| **R11** | Compound units | Use compound units such as speed, rates of pay, unit pricing, including making comparisons. **F+:** density and pressure | R11 | 10.01b | F, F+ | A block of metal has mass 240 g and volume 30 cm³. Work out its density. | 8 g/cm³ | **M1** 240 ÷ 30 oe soi · **A1** 8 with units g/cm³. Units omitted: A0 if the question demands units. |
| **R12** | Ratio of lengths, areas and volumes | Compare lengths, areas and volumes using ratio notation. **F+:** scale factors. **H:** make links to similarity, including trigonometric ratios | R12 | 9.04b, 9.04c, 10.05b, 10.05c | F, F+, H | Two similar solids have surface areas in the ratio 9 : 25. Find the ratio of their volumes. | 27 : 125 | **M1** length ratio 3 : 5 soi (square-rooting) · **A1** 27 : 125 cao. Answer 27 : 125 with no working scores 2. (Higher only.) |
| **R13** | Direct and inverse proportion — equations | Understand that "X is inversely proportional to Y" is equivalent to "X is proportional to 1/Y"; interpret equations describing direct and inverse proportion. **H:** construct and interpret such equations | R13 | 5.02a, 5.02b | F+, H | y is inversely proportional to x². When x = 2, y = 9. Find y when x = 6. | y = 1 | **M1** y = k/x² soi · **M1dep** k = 36 · **A1** 1 cao. (Higher only.) |
| **R14** | Gradient as a rate of change | Interpret the gradient of a straight-line graph as a rate of change. **F+:** recognise and interpret graphs illustrating direct and inverse proportion | R14 | 7.04a, 7.04b | F, F+ | A graph shows cost (£) against number of hours hired, passing through (0, 15) and (4, 55). Interpret the gradient. | £10 per hour | **M1** (55 − 15)/4 or 10 soi · **A1** 10 **with the interpretation** "cost per hour" / "£10 for each extra hour". AO2 — a bare 10 scores M1A0. |
| **R15** | Instantaneous and average rates of change | **H:** Interpret the gradient at a point on a curve as the instantaneous rate of change; apply average and instantaneous rate of change (gradients of chords and tangents) in numerical, algebraic and graphical contexts | R15 | 7.04b | H | On a distance–time graph, explain the difference between the gradient of a chord and the gradient of a tangent. | Chord → average speed over the interval; tangent → instantaneous speed at that moment | **B1** average speed identified with the chord · **B1** instantaneous speed identified with the tangent. AO2. (Higher only.) |
| **R16** | Growth and decay | Set up, solve and interpret the answers in growth and decay problems, including compound interest. **H:** and work with general iterative processes | R16 | 5.03a, 6.03e | F+, H | £6400 is invested at 2.5% compound interest for 8 years. Work out the value of the investment. Give your answer to the nearest penny. | £7797.78 | **M1** 1.025ᵏ (k > 1) oe soi · **M1dep** 6400 × 1.025⁸ oe · **A1** 7797.78 (accept 7797.7785… rot). Year-by-year working is fully acceptable. AQA: the compound interest formula P(1 + r/100)ⁿ is in group 2 — students must know it **or be able to derive it**. *(Adapted from OCR J560/04.)* |

---

## 5. Geometry and measures (G1–G25)

Foundation weighting 15% · Higher weighting 20%. AQA §3.4 · OCR sections 8–10.

### 5.1 Properties and constructions

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **G1** | Conventional terms and notation | Points, lines, vertices, edges, planes, parallel and perpendicular lines, right angles, polygons, regular polygons, polygons with reflection and/or rotation symmetry; standard conventions for labelling sides and angles of triangles; draw diagrams from a written description | G1 | 8.01a–8.01e, 8.01f, 8.04c, 8.06b | F, F+ | Write down the number of lines of symmetry and the order of rotational symmetry of a regular hexagon. | 6 lines; order 6 | **B1** 6 lines · **B1** order 6. |
| **G2** | Ruler and compass constructions | Standard constructions: perpendicular bisector of a line segment, perpendicular to a line from/at a given point, bisecting an angle (including constructing 60°). **F+:** use these to construct given figures and solve loci problems. **H:** know the perpendicular distance from a point to a line is the shortest distance | G2 | 8.01f, 8.02a–8.02d | F, F+, H | Construct the perpendicular bisector of the line AB. You must show your construction arcs. | Correct bisector with arcs | **B2** acceptable perpendicular bisector **with** two pairs of supporting arcs; **B1** acceptable bisector with no or incorrect arcs. Tolerance ± 2 mm and ± 2°; marked with an overlay. *(OCR J560/04 wording.)* |
| **G3** | Angle facts | Angles at a point, angles on a straight line, vertically opposite angles. **F+:** alternate and corresponding angles on parallel lines. Colloquial terms such as "Z angles" are **not acceptable**. Derive and use the angle sum of a triangle, deduce the angle sum of any polygon, derive properties of regular polygons | G3 | 8.03a–8.03d | F, F+ | Work out the size of each interior angle of a regular decagon. | 144° | **M1** (10 − 2) × 180 or 1440 soi, or 360 ÷ 10 = 36 exterior · **M1dep** their 1440 ÷ 10, or 180 − their 36 · **A1** 144 cao. |
| **G4** | Properties of quadrilaterals and plane figures | Derive and apply properties and definitions of special quadrilaterals — square, rectangle, parallelogram, trapezium, kite, rhombus. **F+:** and triangles and other plane figures using appropriate language: isosceles, equilateral, scalene, right-angled, acute-angled, obtuse-angled; pentagon, hexagon, octagon, decagon | G4 | 8.04a, 8.04b, 8.04c | F, F+ | Give one property of a rhombus that a parallelogram does not necessarily have. | All four sides are equal (or: diagonals meet at right angles) | **B1** any correct distinguishing property. AO2. |
| **G5** | Congruence criteria | Use the basic congruence criteria for triangles: SSS, SAS, ASA, RHS | G5 | 9.02a | F+ | Triangles ABC and PQR have AB = PQ, BC = QR and angle B = angle Q. Which congruence criterion proves they are congruent? | SAS | **B1** SAS cao. "Two sides and an angle" without specifying the included angle: B0. |
| **G6** | Deriving results and simple proofs | Apply angle facts, triangle congruence, similarity and properties of quadrilaterals to conjecture and derive results about angles and sides — including Pythagoras' theorem and that the base angles of an isosceles triangle are equal — and use known results to obtain simple proofs | G6 | 8.03a–8.03d, 8.04a, 8.04b, 9.02b, 9.04a, 10.05a | F+ | ABC is an isosceles triangle with AB = AC and angle BAC = 40°. Work out angle ABC, giving reasons. | 70° | **M1** 180 − 40 or 140 soi · **A1** 70 · **B1** reason: base angles of an isosceles triangle are equal **and** angles in a triangle sum to 180°. AO2 — the reason mark is independent, so a correct reason with a wrong angle still scores B1. |
| **G7** | Congruent and similar shapes; transformations | Identify, describe and construct congruent and similar shapes, including on coordinate axes, by rotation, reflection, translation and enlargement. **F+:** fractional scale factors. **H:** negative scale factors | G7 | 8.01g, 9.01a–9.01c, 9.02a, 9.04a, 9.04b | F, F+, H | Describe fully the single transformation that maps shape A onto shape B, where B is A enlarged by scale factor −2 about the origin. | Enlargement, scale factor −2, centre (0, 0) | **B1** "enlargement" · **B1** scale factor −2 · **B1** centre (0, 0). All three components required for full marks — this is the standard "describe fully" convention. Naming two transformations scores 0. (Negative SF Higher only.) |
| **G8** | Combinations of transformations | Describe the changes and invariance achieved by combinations of rotations, reflections and translations, including column vector notation for translations | G8 | 9.01d | F+ | Shape P is reflected in the x-axis, then reflected in the y-axis. Describe the single equivalent transformation. | Rotation of 180° about the origin | **B1** rotation 180° (or half turn) · **B1** centre (0, 0). |
| **G9** | Circle parts | Identify and apply circle definitions and properties: centre, radius, chord, diameter, circumference. **F+:** tangent, arc, sector, segment | G9 | 8.05a | F, F+ | Name the straight line that touches a circle at exactly one point. | Tangent | **B1** cao. |
| **G10** | Circle theorems | **H:** Apply **and prove** the standard circle theorems concerning angles, radii, tangents and chords, and use them to prove related results: angle at the centre = twice the angle at the circumference; angle in a semicircle = 90°; angles in the same segment are equal; opposite angles of a cyclic quadrilateral sum to 180°; a tangent is perpendicular to the radius at the point of contact; tangents from an external point are equal; the perpendicular from the centre to a chord bisects the chord; the alternate segment theorem | G10 | 8.05b–8.05h *(OCR splits this into 7 separate statements, each "Apply and prove")* | H | A, B, C, D lie on a circle. Angle ABC = 78°. Work out angle ADC, giving a reason. | 102° | **M1** 180 − 78 soi · **A1** 102 · **B1** reason: "opposite angles in a cyclic quadrilateral sum to 180°". The reason mark requires the theorem to be **named correctly** — "angles in a circle" is insufficient. (Higher only.) |
| **G11** | Coordinate geometry problems | Solve geometrical problems on coordinate axes | G11 | 8.01g | F+ | A(1, 2), B(5, 2), C(5, 7). Work out the area of triangle ABC. | 10 square units | **M1** base 4 and height 5 identified soi · **A1** 10 cao. |
| **G12** | Properties of 3D solids | Identify properties of faces, surfaces, edges and vertices of cubes, cuboids, prisms, cylinders, pyramids, cones and spheres | G12 | 8.01d, 8.06a | F | How many faces, edges and vertices does a square-based pyramid have? | 5 faces, 8 edges, 5 vertices | **B3** all three correct; **B2** two correct; **B1** one correct. |
| **G13** | Plans and elevations | Interpret plans and elevations of 3D shapes. **F+:** construct and interpret them | G13 | 8.06b | F, F+ | Draw the front elevation and the plan of a cylinder standing on its circular base. | Front elevation: rectangle. Plan: circle | **B1** rectangle · **B1** circle. |

### 5.2 Mensuration and calculation

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **G14** | Standard units of measure | Use standard units of measure and related concepts: length, area, volume/capacity, mass, time, money | G14 | 10.01a, 10.01b | F | A tank holds 2.5 litres. How many cm³ is this? | 2500 cm³ | **B1** cao (1 litre = 1000 cm³). |
| **G15** | Measuring, scale drawings and bearings | Measure line segments and angles in geometric figures, interpret maps and scale drawings, and use bearings — the eight compass point bearings and three-figure bearings | G15 | 8.01f, 10.01c | F+ | The bearing of B from A is 070°. Work out the bearing of A from B. | 250° | **M1** 70 + 180 oe soi · **A1** 250 cao. Answers must be three figures — "25°" scores A0. |
| **G16** | Area and volume formulae (foundation) | Know and apply formulae to calculate: area of triangles, parallelograms, trapezia; volume of cuboids and other right prisms, including cylinders | G16 | 10.03a–10.03c, 10.04a | F+ | A trapezium has parallel sides 7 cm and 11 cm and perpendicular height 6 cm. Work out its area. | 54 cm² | **M1** ½ × (7 + 11) × 6 oe soi · **A1** 54 with units cm². AQA: the trapezium formula is group 2 — known **or derivable**, not given. OCR: not in the 6.02d recall list, so it would be given in the question. |
| **G17** | Circle formulae, perimeter, surface area and volume | Know circumference = 2πr = πd and area = πr²; calculate perimeters of 2D shapes including circles. **F+:** areas of circles and composite shapes. **H:** surface area and volume of spheres, pyramids, cones and composite solids, including frustums. Answers may be required in terms of π | G17 | 10.02a–10.02c, 10.03d, 10.03e, 10.04b, 10.04c | F, F+, H | A solid cylinder of radius 12 cm and height 30 cm is melted down and recast as a single sphere. Work out the radius of the sphere. Give your answer to 3 s.f. | 14.8 cm (accept [14.79, 14.8]) | **M1** π × 12² soi 452–453 · **M1** π × 12² × 30 soi 13 564–13 574 · **B1** ⁴⁄₃πr³ = their 13 571 · **M1** their 13 571 ÷ ⁴⁄₃π or 3240 · **A1** 14.79 to 14.8. Circle formulae must be recalled on both boards; the sphere volume formula is **given in the question** (AQA group 3 / OCR "all other formulae will be given"). *(Adapted from OCR J560/04.)* |
| **G18** | Arcs and sectors | **F+:** Calculate arc lengths, angles and areas of sectors of circles | G18 | 10.02b, 10.02c, 10.03d, 10.03e | F+ | A sector has radius 9 cm and angle 40°. Work out its area, in terms of π. | 9π cm² | **M1** 40/360 × π × 9² oe soi · **A1** 9π cm² cao. Decimal 28.3 also acceptable unless "in terms of π" is demanded — here it is, so 28.3 scores M1A0. |
| **G19** | Congruence and similarity in mensuration | Apply the concepts of congruence and similarity, including relationships between lengths in similar figures. **H:** relationships between lengths, **areas and volumes** in similar figures | G19 | 9.02b, 9.04c | F+, H | Two similar cones have heights 4 cm and 10 cm. The smaller has volume 32 cm³. Work out the volume of the larger. | 500 cm³ | **M1** linear SF 10/4 or 2.5 soi · **M1dep** 2.5³ or 15.625 soi · **A1** 500 cao. Using the linear SF directly (32 × 2.5 = 80) scores M1M0A0. (Higher only.) |
| **G20** | Pythagoras and trigonometry | Know Pythagoras' theorem a² + b² = c² and the trig ratios sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj. **F+:** apply them to find angles and lengths in right-angled triangles in 2D. **H:** apply them in right-angled and, where possible, general triangles in 2D **and 3D** | G20 | 10.05a, 10.05b | F+, H | A right-angled triangle has hypotenuse 13 cm and one other side 5 cm. Work out the third side. | 12 cm | **M1** 13² − 5² oe soi (subtracting, not adding) · **M1dep** √(their 144) · **A1** 12 with units cm. Answer 13.9 (from 13² + 5²) scores M0. Both boards require these formulae to be **recalled** — AQA Appendix group 1, OCR 6.02d. |
| **G21** | Exact trigonometric values | Know the exact values of sin θ and cos θ for θ = 0°, 30°, 45°, 60°, 90°, and of tan θ for θ = 0°, 30°, 45°, 60° | G21 | 10.05c | H | Write down the exact value of cos 30°. | √3/2 | **B1** cao. Decimal 0.866 scores B0 — "exact value" demands the surd form. (Higher only.) |
| **G22** | Sine rule and cosine rule | **H:** Know and apply the sine rule a/sin A = b/sin B = c/sin C and the cosine rule a² = b² + c² − 2bc cos A to find unknown lengths and angles | G22 | 10.05d, 10.05e | H | In triangle ABC, b = 8 cm, c = 5 cm and angle A = 60°. Work out a. | 7 cm | **M1** a² = 8² + 5² − 2 × 8 × 5 × cos 60 soi · **M1dep** 89 − 40 or 49 soi · **A1** 7 cao. Both rules must be recalled (AQA group 1 / OCR 6.02d). A common examiner comment: candidates apply the sine rule to a non-right-angled triangle where the cosine rule is needed — the AO2 version of this question asks candidates to *explain* why a chosen method is wrong (see OCR J560/04 Q3: "it is not a right-angled triangle", **1 mark**, accept any correct response). (Higher only.) |
| **G23** | Area of a triangle using sine | **H:** Know and apply Area = ½ab sin C to calculate the area, sides or angles of any triangle | G23 | 10.03a | H | A triangle has sides 9 cm and 12 cm with an included angle of 40°. Work out its area to 3 s.f. | 34.7 cm² | **M1** ½ × 9 × 12 × sin 40 soi · **A1** 34.7 (accept 34.72…) with units cm². (Higher only.) |

### 5.3 Vectors

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **G24** | Vectors as translations | Describe translations as 2D vectors | G24 | 9.01c, 9.03b | F | Shape A is translated by the vector (3, −2) column form. Describe the movement. | 3 right and 2 down | **B1** cao. |
| **G25** | Vector arithmetic and proof | **F+:** Apply addition and subtraction of vectors, multiplication of a vector by a scalar, and diagrammatic and column representations. **H:** use vectors to construct geometric arguments and proofs | G25 | 9.03a, 9.03b | F+, H | OA = **a** and OB = **b**. M is the midpoint of AB. Express OM in terms of **a** and **b**. | **a** + ½(**b** − **a**) = ½(**a** + **b**) | **M1** AB = **b** − **a** soi · **M1dep** OM = **a** + ½ their (**b** − **a**) · **A1** ½**a** + ½**b** oe. Vector notation must be used — a diagram alone scores 0. (Proof aspect Higher only.) |

---

## 6. Probability (P1–P9)

Probability and statistics combined: 15% at both tiers. AQA §3.5 · OCR section 11.

Both boards require probabilities to be written as fractions, decimals or percentages. **A probability
written as a ratio scores zero**, even when the correct fraction is also shown (AQA marking guidance).

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **P1** | Recording and analysing experimental outcomes | Record, describe and analyse the frequency of outcomes of probability experiments using tables and **frequency trees** | P1 | 11.01b | F | 80 people were tested. 30 were female; 12 of the females passed. Altogether 55 people passed. Complete the frequency tree and find how many males failed. | 7 | **B1** 50 males soi · **B1** 43 males passed soi · **B1ft** 7, ft their values consistently. *(Frequency trees are a distinctive post-2015 question type — worth generating as an interactive drag-and-fill on the platform.)* |
| **P2** | Expected outcomes | Apply ideas of randomness, fairness and equally likely events to calculate expected outcomes of multiple future experiments | P2 | 11.01d | F | A fair spinner has 5 equal sections, 2 of which are red. The spinner is spun 200 times. How many reds would you expect? | 80 | **M1** 2/5 × 200 oe soi · **A1** 80 cao. |
| **P3** | Relative frequency and the probability scale | Relate relative expected frequencies to theoretical probability, using appropriate language and the 0 to 1 probability scale | P3 | 11.01a, 11.01c | F | A biased coin lands heads 63 times in 150 throws. Estimate the probability of heads. | 63/150 = 0.42 | **B1** 63/150 oe, or 0.42, or 42%. Accept unsimplified; ignore an incorrect subsequent simplification once the correct form is seen — **but a ratio such as 63 : 150 scores B0**. |
| **P4** | Exhaustive outcomes summing to 1 | Apply the property that the probabilities of an exhaustive set of outcomes sum to 1. **F+:** an exhaustive set of **mutually exclusive events** sums to 1 | P4 | 11.02e | F, F+ | A bag has red, blue and green counters. P(red) = 0.35 and P(blue) = 0.4. Work out P(green). | 0.25 | **M1** 1 − (0.35 + 0.4) oe soi · **A1** 0.25 oe cao. |
| **P5** | Empirical samples and theoretical distributions | Understand that empirical unbiased samples tend towards theoretical probability distributions as sample size increases | P5 | 11.01c | F+ | A dice is rolled 20 times and gives four sixes. Sam says the dice is biased. Comment on Sam's claim. | The sample is too small to conclude bias; more trials are needed | **B1** an acceptable response identifying the small sample size / need for more trials. AO2 — accept any correct reasoning that is not contradicted. |
| **P6** | Enumerating sets and combinations | Enumerate sets and combinations of sets systematically using tables, grids and **Venn diagrams**. **F+:** including tree diagrams | P6 | 11.02a, 11.02c, 11.02d | F, F+ | In a Venn diagram, 12 students study French, 15 study German and 5 study both. There are 30 students in total. How many study neither? | 8 | **M1** 12 + 15 − 5 or 22 soi (or a correct Venn diagram with 7, 5, 10) · **A1** 8 cao. |
| **P7** | Possibility spaces | Construct theoretical possibility spaces for single and combined experiments with equally likely outcomes and use these to calculate theoretical probabilities | P7 | 11.01d, 11.02a | F | Two fair four-sided dice numbered 1–4 are rolled and the scores added. Work out the probability that the total is 5. | 4/16 = 1/4 | **M1** a correct sample space of 16 outcomes, or 4 successful outcomes identified · **A1** 4/16 oe cao. |
| **P8** | Independent and dependent combined events | **F+:** Calculate the probability of independent and dependent combined events, including using tree diagrams and other representations, and know the underlying assumptions — including knowing when to **add** and when to **multiply** probabilities | P8 | 11.02f | F+ | A bag has 5 red and 3 blue counters. Two are taken without replacement. Work out the probability that both are red. | 20/56 = 5/14 | **M1** 5/8 × 4/7 oe soi (denominator reducing to 7 — recognising dependence) · **A1** 5/14 oe cao. Using 5/8 × 5/8 (with replacement) scores M0A0. |
| **P9** | Conditional probability | **H:** Calculate and interpret conditional probabilities through representation using expected frequencies with two-way tables, tree diagrams and Venn diagrams | P9 | 11.02c, 11.02d, 11.02f | H | A box contains 7 milk and 3 dark chocolates. One is eaten, then another. Given the first was milk, work out the probability the second is dark. | 3/9 = 1/3 | **M1** recognising 9 chocolates remain with 3 dark soi · **A1** 1/3 oe cao. AQA lists P(A and B) = P(A given B) × P(B) as a group 2 formula — known **or derivable**. (Higher only.) |

---

## 7. Statistics (S1–S6)

Probability and statistics combined: 15% at both tiers. AQA §3.6 · OCR section 12.

| Ref | Title | What is taught | AQA | OCR | Tier | Sample question | Answer | Marks & how awarded |
|---|---|---|---|---|---|---|---|---|
| **S1** | Sampling | Infer properties of populations or distributions from a sample, whilst knowing the limitations of sampling | S1 | 12.01a | F+ | A researcher surveys 20 people leaving a gym about how much exercise people do. Give one reason why this sample may be biased. | People leaving a gym are more likely to exercise than the general population | **B1** any valid reason identifying that the sample is unrepresentative. AO2. |
| **S2** | Tables, charts and diagrams | Interpret and construct tables, charts and diagrams: frequency tables, bar charts, pie charts and pictograms for categorical data; vertical line charts for ungrouped discrete numerical data; know their appropriate use, including choosing a suitable statistical diagram. **F+:** tables and line graphs for time series data | S2 | 12.02a | F, F+ | In a pie chart of 60 people, 15 chose football. Work out the angle of the football sector. | 90° | **M1** 360 ÷ 60 or 6 soi, or 15/60 × 360 · **A1** 90 cao. |
| **S3** | Grouped and continuous data diagrams | **H:** Construct and interpret diagrams for grouped discrete and continuous data — histograms with **equal and unequal** class intervals and cumulative frequency graphs — and know their appropriate use | S3 | 12.02b | H | A histogram has a bar covering 10 ⩽ x < 25 with frequency density 4. How many data values are in this class? | 60 | **M1** class width 15 soi · **M1dep** 15 × 4 · **A1** 60 cao. Reading the height as the frequency scores 0. (Higher only.) |
| **S4** | Analysing and comparing distributions | Interpret, analyse and compare distributions of univariate data through appropriate graphical representation (discrete, continuous, grouped) and appropriate measures of central tendency (median, mean, mode, modal class) and spread (range, including consideration of outliers). Know the terms primary data, secondary data, discrete data, continuous data. **H:** including box plots, quartiles and the interquartile range | S4 | 12.02b, 12.03a, 12.03b, 12.03d | F, F+, H | Two classes take a test. Class A: median 62, IQR 8. Class B: median 58, IQR 15. Compare the two distributions. | A scored higher on average (larger median) and was more consistent (smaller IQR) | **B1** a correct comparison of averages **in context**, referring to the median · **B1** a correct comparison of spread **in context**, referring to the IQR. AO2 — quoting the figures without comparison, or comparing without context, scores 1 at most. **OCR additionally examines 12.03b** (recognising graphical misrepresentation through incorrect scales or labels) and **12.03d** (identifying outliers, progressing to outliers on scatter graphs) as separate statements. |
| **S5** | Describing a population | Apply statistics to describe a population | S5 | 12.03a | F+ | 30 students have a mean height of 1.55 m. A student of height 1.85 m joins. Work out the new mean, to 3 s.f. | 1.56 m | **M1** 30 × 1.55 or 46.5 soi · **M1dep** (their 46.5 + 1.85) ÷ 31 · **A1** 1.56 (accept 1.5596… rot). |
| **S6** | Scatter graphs, correlation and lines of best fit | Use and interpret scatter graphs of bivariate data; recognise correlation and know it **does not indicate causation**; draw estimated lines of best fit; make predictions; interpolate and extrapolate apparent trends whilst knowing the dangers of doing so. Know the terms positive, negative, no, weak and strong correlation | S6 | 12.03c | F, F+ | A scatter graph shows ice cream sales against temperature, with strong positive correlation. Jo says hot weather causes people to buy ice cream. Comment on Jo's statement. | Correlation does not imply causation; another factor may explain the relationship | **B1** identifying that correlation does not establish causation. AO2 — simply restating "there is positive correlation" scores B0. |

---

## 8. How questions are written, asked and marked

Observations drawn from published papers and mark schemes (AQA 8300/1F June 2022, AQA marking
guidance 2023, OCR J560/01 and J560/04 mark schemes). These are the patterns a question generator
must reproduce for output to feel like a real paper.

### 8.1 Question archetypes and their typical mark tariffs

| Tariff | Archetype | Marking shape | AO |
|---|---|---|---|
| **1 mark** | Recall or single-step: "Write down…", "Work out 30% of 60" | Single **B1**, usually `cao` | AO1 |
| **1 mark** | Justification: "Give a reason for your answer", "Comment on…" | **B1** for any acceptable response, "must not be contradicted" | AO2 |
| **2 marks** | Two-step routine calculation | **M1** method · **A1** answer | AO1 |
| **2 marks** | Construction or accurate drawing | **B2** correct with arcs/tolerance · **B1** correct without supporting arcs | AO1 |
| **3 marks** | Multi-step in context | **M1** · **M1dep** · **A1**, often with **SC1** for a named misconception | AO1/AO3 |
| **3 marks** | "Describe fully the single transformation…" | **B1** per component (type, amount, centre/line) — all three needed | AO2 |
| **3–4 marks** | Proof / "Show that…" | **M1** algebraic setup · **M1dep** manipulation · **A1** conclusion stated. Numerical examples score 0 | AO2 |
| **4–6 marks** | Extended problem drawing on several topics | A chain of M marks per identifiable stage, terminating in **A1**; frequently `dep on M3` | AO3 |
| **5–6 marks** | Compare-two-scenarios ("which is better value?", "compound vs simple interest") | Marks for each strand computed independently, then **M1** for the comparison step, **A1** for the answer **and** the conclusion | AO3 |

An authentic 6-mark OCR item looks like this (J560/04, compound vs simple interest):
**M2** for 6400 × 1.025⁸ (or **M1** for 1.025ᵏ, k > 1) · **AND** · **M2** for 6400 + 6400 × 0.027 × 8
(or **M1** for 6400 × 0.027) · **AND** · **M1** for subtracting their two totals · **A1** 15.38 cao.
Note the structure: two independent parallel strands, then a combining mark, then accuracy.

### 8.2 Instruction wording and what it changes

| Wording | Effect on marking |
|---|---|
| *(no instruction)* | A bare correct answer scores full marks. |
| "You must show your working" | No working, no marks — even if the answer is right. |
| "Show that…" / "Prove that…" | The conclusion is given, so all marks are for the argument. A numerical demonstration of a general statement scores 0. |
| "Give your answer to 2 d.p. / 3 s.f." | The accuracy mark requires that accuracy. OCR still marks at the greatest number of significant figures seen in the working if no accuracy is specified. |
| "Give your answer in terms of π" | A decimal answer loses the accuracy mark. |
| "Give a reason for your answer" | Adds an independent **B1**, awardable even if the numerical answer is wrong. |
| "Describe fully" | Every component of the description is required; naming two transformations instead of one scores 0. |
| "Estimate" | The exact answer is **not** creditworthy — marks are for sensible rounding first. |
| "Comment on" / "Is X correct?" | AO2. Requires an evaluative statement, not a restatement of the data. |

### 8.3 Structural conventions

- **Demand ramps within each paper.** AQA states it explicitly: "The mathematical demand increases as a
  student progresses through the paper." A generated mock must order items by demand, not randomly.
- **Synoptic questions are mandatory.** Both boards require questions that draw together elements from
  different topic areas. A mock built by sampling one topic per question is not a valid mock —
  roughly the last third of each paper should be multi-topic.
- **Extended responses are mandatory.** OCR: "Some questions will require an extended response to allow
  learners to demonstrate the ability to construct and develop a sustained line of mathematical
  reasoning." Budget 1–2 such items per paper.
- **Part-structured questions** ((a), (b), (c)) let a student who loses marks in (a) still gain full
  marks in (b) via follow-through — AQA notes a student cannot score full marks from an A1ft **unless**
  the question is split into parts.
- **Tolerances** are specified for any measured or constructed answer (typically ± 2 mm, ± 2°) and
  marked against an overlay.
- **Method restrictions** are sometimes stated: OCR notes "Trial-and-improvement will score 0 or 5 only"
  on an algebraic problem — the method is not creditworthy in stages.
- **Working in different units** is generally allowed ("allow work in £ or p"), and alternative full
  methods are always credited: "For methods not provided for in the mark scheme give as far as possible
  equivalent marks for equivalent work."

### 8.4 Misconceptions the schemes track explicitly

Special-case marks are the boards telling you which wrong answers are *common enough to be worth
naming*. These are the highest-value targets for a gamified platform's diagnostic engine, because each
one is a labelled, specific misconception rather than a generic "wrong":

| Topic | SC / common error seen in schemes | Underlying misconception |
|---|---|---|
| Rounding then multiplying | `SC1 (31 × 18 =) 558, answer 560` | Rounding both values in the wrong direction |
| Reverse percentages | Adding 15% instead of dividing by 0.85 | Treating percentage change as symmetric |
| Sharing in a ratio | Giving the two shares but not the difference asked for | Not answering the question actually asked |
| Similar shapes | Applying the linear scale factor to volumes | Scale factor not raised to a power |
| Probability | Denominator unchanged in "without replacement" | Independence assumed by default |
| Error intervals | `23.5 ⩽ L ⩽ 24.5` | Upper bound treated as attainable |
| Standard form | Answer left as 12.8 × 10³ | Not normalising A to 1 ⩽ A < 10 |
| Order of operations | 5 + 3 × 4 = 32 | Strict left-to-right evaluation |
| Trigonometry | Sine rule applied to a right-angled/wrong configuration | Method chosen by familiarity, not by given information |

### 8.5 Marking rules that a software auto-marker must encode

Ranked by how often they decide a mark in the published schemes:

1. Accept `oe` — equivalent fractions, decimals, percentages, unsimplified forms, algebraically
   equivalent expressions (`3x + 2` ≡ `2 + 3x`; `y = 3.5x` ≡ `y = 7x/2`).
2. Award M marks from *any* correct value appearing anywhere in the response, including the answer line.
3. Follow through: re-evaluate later steps against the student's own earlier (wrong) value.
4. Accept ranges: `[14.79, 14.8]`, `figs 125`, `3.14…`.
5. Ignore subsequent working once a correct answer is seen — unless it contradicts, or the scheme says
   `mark final answer`.
6. Penalise premature approximation once (1 mark), not repeatedly.
7. Never award A after M0.
8. Require units only where the question or scheme demands them.
9. Reject probability written as a ratio, always.
10. On a misread that does not make the question easier, keep the M marks and deduct only accuracy marks
    (OCR: 1 mark; AQA: up to 2).

---

## 9. Coverage summary

| Strand | DfE / AQA refs | Rows in this map | OCR statements mapped | Foundation weighting | Higher weighting |
|---|---|---|---|---|---|
| Number | N1–N16 | 16 | 27 (OCR sections 1–4) | 25% | 15% |
| Algebra | A1–A25 | 25 | 34 (OCR sections 6–7) | 20% | 30% |
| Ratio, proportion and rates of change | R1–R16 | 16 | 7 (OCR section 5; percentage and compound-unit statements also sit in OCR sections 2 and 10) | 25% | 20% |
| Geometry and measures | G1–G25 | 25 | 58 (OCR sections 8–10) | 15% | 20% |
| Probability | P1–P9 | 9 | 10 (OCR section 11) | 15% combined | 15% combined |
| Statistics | S1–S6 | 6 | 7 (OCR section 12) | *(with probability)* | *(with probability)* |
| **Total** | **97** | **97** | **143** | 100% | 100% |

OCR's 143 assessed content statements map onto the same 97 DfE statements — the extra granularity is
pedagogical sequencing, not extra content. The only statements without a one-to-one DfE partner are
OCR's explicit treatments of graphical misrepresentation (12.03b) and outliers (12.03d), both of which
sit inside DfE S4, and OCR's kinematics-formulae statement (6.02e), which sits inside A2/A3/A5.

---

## 10. What this implies for the platform

Recorded here because it follows directly from the research, not as a design proposal:

1. **Author against the DfE ref, tag by board.** Since content is common, a per-board question bank
   would be 97 items duplicated for no benefit. Board-specific fields: reference code, tier column,
   whether a formula is given or must be recalled, paper number and calculator status.
2. **Store mark schemes as structured steps, not prose.** Each step needs: type (`M`/`A`/`B`), value,
   dependency, follow-through source, accepted forms (`oe` list, ranges, `figs`), and a
   misconception tag for SC marks. This is what makes both auto-marking and diagnostic feedback
   possible from one data structure.
3. **The SC marks are the gamification hook.** They are a ready-made, board-authored taxonomy of named
   misconceptions. Progress tracking against *misconceptions cleared* is more meaningful — and more
   motivating — than a raw percentage, and it maps onto the marks a student actually loses.
4. **Mock generation is constrained, not random.** A valid mock must hit the topic-area weightings
   (§1.4), the AO split (§1.4), the demand ramp, at least one extended-response item, and synoptic
   questions in the final third — at the right total (80 marks AQA / 100 marks OCR) for a 90-minute paper.
5. **Calculator status is a property of the paper, not the topic.** Both boards state that all content
   may be assessed on either type of paper, so every question needs a non-calculator variant flag
   rather than a fixed assignment.

---

## Sources

- AQA, *GCSE Mathematics (8300) Specification*, v1.0 — https://cdn.sanity.io/files/p28bar15/green/04698c10815b90196fae18e4977d9dd8057d7892.pdf
- Cambridge OCR, *GCSE (9–1) Mathematics (J560) Specification*, v2.0 (May 2026) — https://www.ocr.org.uk/Images/168982-specification-gcse-mathematics.pdf
- AQA, *Marking guidance: Higher and Foundation tiers, 8300 Mathematics*, v1.0 (Oct 2023) — https://filestore.aqa.org.uk/resources/mathematics/AQA-8300-NG-MARKING-GUIDANCE.PDF
- AQA, *GCSE Mathematics 8300/1F Mark scheme*, June 2022 — https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-83001F-MS-JUN22.PDF
- OCR, *J560/04 Paper 4 (Higher tier) Mark Scheme* — https://www.ocr.org.uk/Images/563142-mark-scheme-paper-4.pdf
- OCR, *J560/01 Paper 1 (Foundation tier) Mark Scheme* — https://www.ocr.org.uk/Images/563139-mark-scheme-paper-1.pdf

*Sample questions in this document are original items written in the style of the published papers,
except where marked "Adapted from", which reproduce the mark-scheme structure of a real question.*
