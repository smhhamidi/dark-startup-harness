---
name: jobs-to-be-done
description: >-
  Find the real job (the need) behind what users ask for (the want), and design
  or judge alternatives against it: job statements, the job map, the four forces
  of switching, competing solutions including doing nothing, opportunity
  scoring, feature-removal tests, and reframing the question before any
  analysis. Use when the user says JTBD, jobs to be done, want vs need, hire or
  fire, "what are customers really trying to do", "customers ask for X — should
  we build it", feature removal, a new product line, positioning against a
  competitor — and before any "what should we do about X" strategy answer, even
  when nobody says JTBD. Pairs with data-sufficiency before a number decides (not shipped with this pack — owner-supplied; see PROVENANCE.md).
---

# Jobs to be done (JTBD)

> **Source:** the root playbook credited in [CREDITS.md](../../CREDITS.md), MIT licence, imported 2026-10-07 by the principal's pick under the outside-playbook rule. This copy is the workspace canonical with the company-local sections and this provenance scrubbed for public travel; re-derive it on upstream re-import (the weekly outside-playbook check). The body is otherwise the imported original.

Sources, from the literature as known to the model, not re-read in the session that wrote this skill
(2026-09-16). Treat quotes as paraphrases:
- **[C]** Clayton Christensen et al., *Competing Against Luck* (2016) and "Know Your Customers' Jobs to Be
  Done", HBR 2016: a job is the progress a person tries to make in a particular circumstance; people
  "hire" a product to make it and "fire" it when something does it better. Milkshake story.
- **[U]** Tony Ulwick, *What Customers Want* (2005) / *Jobs to be Done* (2016), Outcome-Driven Innovation:
  the job map, desired-outcome statements, and the opportunity score.
- **[M]** Bob Moesta, *Demand-Side Sales 101* (2020), with Chris Spiek: the four forces and the switch interview.
- **[K]** Alan Klement, *When Coffee and Kale Compete* (2016): job stories, and competition across
  categories.
Anything not tagged is this skill's own addition.

**Evidence status:** the literature summary above was written from model knowledge on 2026-09-16 and has not been re-read against the sources since — treat every tagged claim as a paraphrase until verified. The active evidence rules inside the procedure: scope-match each complaint source and name its bias (step 3); secondary data produces hypotheses only, never findings (step 6); the switch-interview stopping rule is ten to fifteen interviews, and contacting users is outward-facing — the person you work for decides who and how.

## The model

- **Want vs need.** A want is a solution the user names ("keep the CD drive"). The job is the progress
  that solution buys ("move my files and install software"). Ask *why* until you reach progress that
  does not name any product [C]. People hire a product to make progress, they do not want the product itself.
- **The job is stable and the solutions change.** "Get treated by someone I trust, soon" existed before
  online booking and will outlast it [U]. Design against the job, not against today's solution.
- **Circumstance defines the job** [C]: who, when, where, what else is going on. The same person has
  different jobs at 2 a.m. with a feverish child and when planning a yearly check-up. Segment by
  circumstance, not by demographics.
- **Three dimensions** [C]: functional (get the appointment), emotional (stop worrying, feel in
  control), social (be seen as a good parent, not look foolish in front of the doctor). The emotional
  and social sides often decide the hire.
- **The competition is whatever else gets hired** [C][K]: other apps, but also phoning the clinic,
  walking in and waiting, asking a relative who is a nurse, searching symptoms online, or doing nothing
  (non-consumption). Doing nothing is often the biggest competitor.
- **The four forces of switching** [M]. A switch happens only when push + pull are greater than anxiety + habit:
  - Push: the struggling moment with the current way.
  - Pull: the attraction of the new way.
  - Anxiety: fear about the new way (will the doctor really be there? is paying online safe?).
  - Habit: comfort with the old way (I always phone the secretary).
  Most products only add pull. Reducing anxiety and habit is often cheaper.
- **Job map** [U]: every job moves through define → locate → prepare → confirm → execute → monitor →
  modify → conclude. Unmet needs hide in the steps the product ignores, usually before and after the
  "execute" step it was built for.
- **Desired outcomes** [U]: how users measure success at each step, written as
  *direction + metric + object + context*, for example "minimise the time it takes to find a doctor who
  can see me today". Solution-free and measurable.
- **Opportunity score** [U]: importance + max(importance − satisfaction, 0), each rated 0–10 by users.
  An outcome that is important but poorly served (score above about 10) is underserved. One that is
  well served and less important is overserved, which is where simpler or cheaper disruption starts.
- **Job stories** [K] replace personas in specs: "When <situation>, I want to <motivation>, so I can
  <expected outcome>."
- **Big hire vs little hire** [C]: the big hire is the decision (sign up, book). The little hire is
  actually using the product next time. Habit is built on the little hire; a product can win the big
  hire and still be fired quietly.

## Reframe before analysing — do this first, in any analysis

An analysis answers the question it was handed. Design thinking's core move is to change the question
first. Before any judgement, recommendation, priority call or strategy answer:
1. **State the frame you were handed** in one line ("which plumber should the household pick?").
2. **Write at least three others.** Ways to get them: climb from the solution to the goal (find a plumber
   -> fix the leak -> stop worrying about the house); change the unit (one job -> the home's upkeep over
   a year); invert it (how would we guarantee the leak never gets fixed?); borrow an analogy from another
   field (a building's facilities desk: residents report a problem, they do not pick a tradesperson);
   change whose problem it is (household -> tradesperson -> landlord); make the constraint the subject
   (trust is attached to a named tradesperson, not to us).
3. **Say which frame you are working in and why**, and note what that frame makes invisible.
A number only means something inside a frame, so a frame taken for granted is how as-is data turns into
a ceiling (see the next section). Illustrative example (an invented home-repair marketplace): reframing the
unit from the booking to the home's upkeep puts failures such as a no-show, a repair that needs a second
visit or a disputed invoice in the gaps *between* steps, which the booking frame cannot see.

## Design the to-be, not the as-is

Today's behaviour is a **baseline to move**, never a limit on the strategy. "Only 15% of households
describe the problem instead of picking a tradesperson" describes how people hire *today's* product; it
does not prove they must pick a person first. Ask what the job would look like if the product did it
perfectly, then treat each as-is number as the gap to close. Illustrative to-be (the same invented
marketplace): households report a problem and the product gets it fixed, the way residents call a
facilities desk. The analysis then asks what would make them trust that more than a neighbour's tip:
diagnosis at intake, vetted tradespeople, a guarantee when a repair fails, a record of the home's history.
Before sending any strategy judgement, check each "but" against this: is it a fact about the job, or
only about today's product?

## Alternative design: removing or replacing what users ask for (own addition)

Before removing or refusing a requested feature, pass all three tests:
1. **The job is covered.** Name the job the feature serves. A replacement does that job at least as well
   in the users' circumstances, not only in ours.
2. **The gain is felt.** Users get something they notice, such as less weight, less time or less worry.
3. **There is a bridge.** People still bound to the old way have a path through (Apple's external CD drive).
Failing test 1 is the classic mistake: Apple's 2016 port removal, reversed in 2021.
Start with **lead users** (von Hippel), a few people who feel the need early and strongly and have a
point. Their need shows direction. Their proposed solution is still only a want.

## Procedure

1. **Frame.** Name the side (for a two-sided marketplace: buyer, seller, and any intermediary; never merge them) and the decision the analysis must
   serve. If no decision depends on it, say so.
2. **Name the core job and its situations first**, before walking any complaint list. Take them from
   evidence of why people *start, keep or stop* using the product (switch timelines, first-booking
   channel, repeat use), from any want the requester already gave, and from the person's life outside
   our product. One core job, then 3-5 situations. For each: job statement (verb + object + context),
   functional, emotional and social sides, what they *ask for* (want) against what they *need*, and what
   else they hire (including doing nothing). Share this draft early, labelled as hypotheses, and run
   long data pulls in the background meanwhile.
3. **Use complaints only to locate gaps.** Complaint sources (support tickets, store reviews, in-product
   chats between the two sides, zero-result search logs) cover *where we fail*, not *what
   people are trying to do* (scope-match: a complaint speaks only for its source). Place each complaint
   on a step of a job's map as a fire moment; never cluster complaints and call each cluster a job. Name
   each source's bias. Behaviour data shows *what* people do; words show *why*.
   **Check every job row before keeping it:** no product noun (booking, payment, app, a feature); not a
   step of another job in the same table; not merely a situation; functional, emotional and social sides
   all present.
   Typical failure: a job table built by clustering a complaint backlog comes out as renamed failures,
   one naming the product and others being steps of one job. When the requester already gave the want,
   finding the job is quick; finding jobs from scratch with no given want takes longer, and that time is
   not itself a defect.
4. **Walk the job map** for the top jobs. At each step write 2–5 desired-outcome statements and mark
   where today's product is absent.
5. **Weigh the forces** for the switch you want (for example from phoning the clinic to booking online):
   push, pull, anxiety, habit, each with evidence.
6. **Judge.** Which jobs are underserved, and for whom. Secondary data only produces *hypotheses*. Run the
   `data-sufficiency` skill before a number decides anything (not shipped with this pack —
   owner-supplied by hand, see PROVENANCE.md; without it, label the judgment an evaluation,
   never a number). Confirmation needs switch interviews
   (below) or an importance/satisfaction survey. Order the work by harm over cost, with a named
   affected user, as a queue to investigate rather than a plan, not by opportunity score alone.
7. **Design implications** as job stories, each with the force it moves and how to test it by behaviour.

### Observation first, then the conversation
People do not say everything they do, and what they say differs from what they do. So confirm a job first
by watching behaviour: session replays, analytics funnels and repeat patterns, the messages people
actually write (for example chats between the two sides), and who they book for. The limit is that our own data
only shows behaviour *inside* our product. Phoning the secretary, the pharmacist, or deciding to wait never
reach our logs. For those, and for the *why* (anxiety, social pressure), use contextual inquiry (watch
and ask in the real setting) or a switch interview. A switch interview rebuilds a real past event and is
not an opinion survey. Watching or talking to users in person is outward-facing, so the person you work
for decides (shared rulebook: a principal gates outward-facing contact).

### Switch interview (to confirm a job) [M]
Interview recent switchers (hired or fired within about 90 days). Rebuild the timeline: first thought →
passive looking → event that started active looking → options considered → decision → first use →
satisfied or not. Ask about the scene (where were you, who was there, what happened just before), not
opinions. Ten to fifteen interviews usually show the pattern. Contacting real users is outward-facing:
the person you work for decides who and how (shared rulebook: a principal gates outward-facing contact).

## Output

- One table per side: circumstance | job statement | dimensions | competing solutions | evidence (source,
  number, date, or "inferred") | served / underserved / unknown.
- Job maps for the top 2–3 jobs, with the outcome statements and the gaps.
- Forces diagram for the key switch.
- Job stories as design implications, each with a behavioural test.
- Open questions that only interviews or the person you work for can settle.
Plain language, answer first.

## Standing product constraints

Before designing, collect the product decisions already made where you work (for example: "prices shown
include every fee", "cancelling is as easy as signing up") and treat them as constraints on every
alternative. One applies everywhere:
- Goodhart's law: a job metric that becomes a target gets gamed. Test the user's progress, not the count.
