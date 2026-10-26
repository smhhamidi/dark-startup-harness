# Where each method in this skill comes from

> **Source:** the root playbook credited in [CREDITS.md](../../../CREDITS.md), MIT licence, imported 2026-10-07 by the principal's pick under the outside-playbook rule. This copy is the workspace canonical with the company-local sections and this provenance scrubbed for public travel; re-derive it on upstream re-import (the weekly outside-playbook check). The body is otherwise the imported original.

Read 2026-09-21. Each entry says what was taken and what was deliberately left out.

## Systematic debugging as a whole

- **Andreas Zeller, *Why Programs Fail: A Guide to Systematic Debugging* (2nd ed.)** — the
  TRAFFIC sequence: Track, Reproduce, Automate (and simplify the test case), Find origins, Focus,
  Isolate, Correct. The three-stage model this skill's §7 uses: the programmer makes a **defect**
  in the code, the defect **infects** program state, the infection surfaces as an observable
  **failure**. <https://www.amazon.com/Why-Programs-Fail-Systematic-Debugging/dp/0123745152>
- **The Debugging Book (Zeller et al., 2021), "Introduction to Debugging"** — the scientific loop:
  question → hypothesis → predicted consequence → experiment → repeat until hypothesis and
  observation stop disagreeing. And the bar this skill's §7 enforces: a diagnosis must show both
  *causality* (how the defect produces the failure) and *incorrectness* (why the code is wrong) —
  symptoms disappearing is not a diagnosis.
  <https://www.debuggingbook.org/html/Intro_Debugging.html>

## Reducing the input

- **The Debugging Book, "Reducing Failure-Inducing Inputs" (ddmin)** — the exact algorithm in §3:
  start at granularity n=2 and test complements; when a complement still fails (the reduction
  succeeded) continue with it at max(n-1, 2), and when no complement fails double n up to the
  element level, terminating 1-minimal (removing any single element makes it
  pass). Best case logarithmic, worst case quadratic. States the precondition this skill makes
  step 1: **the test must be deterministic**, or the result is unreliable.
  <https://www.debuggingbook.org/html/DeltaDebugger.html>
- **Zeller & Hildebrandt, "Simplifying and Isolating Failure-Inducing Input" (IEEE TSE 2002)** —
  the original, and the source of the distinction this skill leans on: *simplifying* one failing
  input versus **isolating** the difference between a passing and a failing input.
  <https://www.cs.purdue.edu/homes/xyzhang/fall07/Papers/delta-debugging.pdf>
- **John Regehr, "Generalizing and Criticizing Delta Debugging"** — why the textbook algorithm
  under-performs on structured input (it stalls at local maxima), and the **validity problem**:
  a reducer that emits input the system never accepts wanders off; he assigns invalid cases zero
  fitness. This is why §2 requires the oracle to reject invalid cases, and §3 says delete
  structure rather than bytes. Also his framing that the lasting contribution is treating
  reduction as a *search*, not one particular algorithm. <https://blog.regehr.org/archives/527>

## Reducing the change

- **`git bisect` documentation** — `git bisect run` exit codes used verbatim in §4: 0 = old/good,
  1–127 (except 125) = new/bad, **125 = untestable → skip**, ≥128 = abort. The `--term-old` /
  `--term-new` generalization (e.g. fast/slow, fixed/broken) is what lets the same machinery
  bisect properties other than "is it broken". <https://git-scm.com/docs/git-bisect>

## Non-determinism

- **Robert O'Callahan et al., "To Catch a Failure: The Record-and-Replay Approach to Debugging"
  (ACM Queue, 2020)**, and **rr** — the principle behind §1's "record instead of retry": if the
  inputs to a process are captured and replayed exactly, a deterministic CPU reproduces the run.
  Built at Mozilla precisely for low-frequency nondeterministic failures. Pernosco extends a
  recording into queryable execution history.
  <https://queue.acm.org/detail.cfm?id=3391621> · <https://rr-project.org/>
  *Not adopted*: rr itself is a Linux ptrace tool for local processes; for a networked service the
  equivalent is capturing the request/bucket/tag and replaying against the service.

## Field discipline

- **David J. Agans, *Debugging: The 9 Indispensable Rules*** — Understand the System · Make It
  Fail · Quit Thinking and Look · Divide and Conquer · Change One Thing at a Time · Keep an Audit
  Trail · Check the Plug · Get a Fresh View · If You Didn't Fix It, It Ain't Fixed. Rules 2, 4, 5,
  6 and 9 are §1, §3–5, §6 and §7 of this skill. Rule 9 is the on/off test.
  <https://debuggingrules.com/> · rule list confirmed at
  <https://embeddedartistry.com/blog/2017/09/06/debugging-9-indispensable-rules/>
- **Stack Overflow, "How to create a Minimal, Reproducible Example"** — minimal, complete,
  reproducible, plus "state exactly what you did to run it". The source of §1's insistence that a
  reproduction is a *command with every axis pinned*, not a description.
  <https://stackoverflow.com/help/minimal-reproducible-example> · background:
  <https://en.wikipedia.org/wiki/Minimal_reproducible_example>

## Performance-shaped problems

- **Brendan Gregg, the USE Method** — per resource: Utilization, Saturation, Errors. Claimed to
  resolve roughly 80% of server issues for 5% of the effort, and bounded in his own words: "While
  the USE Method may find 80% of server issues, latency-based methodologies (eg, Method R) can
  approach finding 100% of all issues." He frames it as coverage, not as a category it cannot
  touch — so a clean pass is not evidence of health, but do not claim it "cannot see latency".
  <https://www.brendangregg.com/usemethod.html>

## Deliberately not in the skill

- Statistical / spectrum-based fault localisation (ranking lines by how often they appear in
  failing vs passing runs). Needs a large suite of passing and failing runs over the same code;
  production failures typically arrive one at a time, from production, across services.
- Automated program repair and fuzzing-based test generation — a different job than isolating one
  reported failure.
