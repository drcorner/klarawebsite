# The Klara Project — "Founding 100" Marketing Plan

**Goal:** Acquire monthly recurring donors, branded as the **Founding 100** — the first 100 monthly partners of The Klara Project.

**Strategy in one paragraph:** Go deep on one ecosystem — Facebook and Instagram — where Klara's highest-propensity donors (churchgoing Christian parents and grandparents, ages 35–65) already spend time and already give. The creative engine is short studio-produced video featuring **young people talking about faith and AI**, with Tony appearing occasionally to frame and build trust. Strangers are converted through a compressed funnel: post or ad → free high-value resource ("A Parent's Guide to AI") → short email nurture → Founding 100 monthly gift ask ($25–100/month, with the site's existing 3/6/12-month fixed-term option lowering the barrier). Reach is borrowed from creators and group communities where these people already gather — never bought through scraping or cold outreach to individuals.

**Constraints this plan is built around:**

| Constraint | Design response |
|---|---|
| Operators: Tony + AI agents only | Every task below is written as an agent brief; Tony's time is capped at ~4–6 hrs/week |
| Budget: $500–1,500/month | Meta ads $450–900, creator placements $0–400, tools ≤$150 |
| Tony prefers others (young people) on camera | Gen Z voices carry the feed — which is also the stronger donor frame ("platform the next generation") |
| 501(c)(3) approved; white paper done | Tax-deductibility messaging updates day one; white paper feeds the new lead magnet |
| No FB/IG accounts or email list yet | Phase 0 builds accounts; warm-network launch seeds the list and the first ~25 members |

---

## 1. Guardrails — what agents must NEVER do

These are hard rules for every agent executing any task in this plan. They exist for legal, platform-policy, and mission-integrity reasons — Klara's brand is human dignity and trustworthiness, and one spam incident costs more than any campaign gains.

1. **No scraping or storing identifiable individuals.** Never compile lists of named social-media users, commenters, or group members. Audience research is done at the **aggregate level only** (themes, language, counts — no names, handles, or profiles of private individuals).
2. **No unsolicited DMs or automated comments.** Never mass-message individuals. One-to-one outreach is permitted only to **public figures and organizations** (creators, page admins, ministry leaders, journalists) in a professional capacity.
3. **Humans post; agents draft.** Comment replies and group participation are posted by Tony himself. Automated posting to groups or comment threads risks account bans and violates most group rules.
4. **Email only to opt-ins.** All email goes through HubSpot to contacts who opted in, with working unsubscribe (CAN-SPAM). Never import purchased or scraped lists.
5. **Religious-belief data is sensitive.** Never tag, score, or segment named individuals by religion. Interest-based ad targeting through Meta's own tools is fine; building our own religion-labeled people database is not.
6. **No fake anything.** No engagement pods, purchased followers, fake reviews, or undisclosed AI-generated imagery (site policy already requires "Image generated with AI" disclosure — keep it).
7. **Respect group rules.** Many Facebook groups prohibit promotion. Participate to be useful; share Klara resources only where rules allow or admins invite it.
8. **Meta "social issues" ads:** ads discussing AI policy/societal impact may trigger Meta's Social Issues authorization requirement. If flagged, complete the advertiser authorization process (Tony's ID verification) — never rephrase ads to evade the classifier.

---

## 2. The offer: Founding 100

**Framing:** "Be one of the first 100 monthly partners who make this mission possible." Membership framing with a visible number consistently outperforms plain donate buttons for new nonprofits — it creates identity, urgency, and social proof without hype.

**Benefits (low-cost, high-meaning):**
- Name listed on a Founding Partners page (opt-in)
- Monthly insider update from Tony (what's being built, what's next — candid, not polished)
- Early access to the video curriculum and conversation guides as they're produced
- Invitation to a quarterly live video call with Tony and the young voices from the videos
- Founding member status is permanent — "you were here when it started"

**Ask levels:** $25 / $50 / $100 per month (site defaults already match). The fixed-term option (3/6/12 months) is offered as "not ready for open-ended? Join for a season."

**Progress mechanic:** A "XX of 100" counter on the site and in posts. Momentum posts at 25, 50, 75, 100.

---

## 3. Phase 0 — Foundations (Weeks 1–2)

### 0.1 Update 501(c)(3) language site-wide *(agent task — this repo)*
Now that the IRS determination letter is received, replace "has applied for 501(c)(3) tax-exempt status… retroactive" language with confirmed status. Locations found:
- `client/src/components/DonationForm.tsx:355`
- `client/src/pages/TermsOfService.tsx:67`
- `client/src/pages/ManageDonation.tsx:372` and `:463`

Suggested copy: *"The Klara Project is a 501(c)(3) tax-exempt organization. Donations are tax-deductible to the extent allowed by law. Please retain this receipt for your records."* (Add EIN once Tony provides it — donors' tax software asks for it.)

### 0.2 Create the Meta presence *(Tony creates accounts; agent drafts everything)*
Agents cannot own accounts, so this is the one setup block requiring Tony's hands (~1–2 hours, with every field pre-drafted by an agent):
- Facebook Page + Instagram account for The Klara Project; Meta Business Suite; ad account with payment method; domain verification for klaraproject.org
- Profile/bio copy, cover images, pinned post — agent-drafted in advance
- **Meta Pixel + key events** (PageView, Lead on guide download, InitiateCheckout/Purchase on donate flow) installed on the site *(agent task — this repo)*
- Enroll in **Meta's nonprofit Giving Tools** (501(c)(3) verification) — unlocks native Facebook fundraisers later
- Apply for **Google for Nonprofits → Google Ad Grants** ($10,000/month in free search ads). Even in a Meta-centric plan this is free money for searches like "AI and Christianity," "Christian parenting AI" pointing at the guide. Low effort, no ongoing cost.

### 0.3 Build the Founding 100 offer *(agent task — this repo + HubSpot)*
- Add Founding 100 framing to `/donate` (counter, benefits list, membership language) and a short `/founding-100` landing page
- HubSpot: `founding_member` property, Founding 100 list, confirmation email
- Thank-you page and receipt copy updated to welcome members, not just thank donors

### 0.4 Create the lead magnet: "A Parent's Guide to AI" *(agent task)*
The white paper is the credibility document; parents need something faster and warmer. Agent drafts an 8–12 page guide from the white paper plus Phase 1 listening data. Working title: *"A Parent's Guide to AI: 7 Conversations to Have With Your Kids This Month."* Format: practical, scripture-grounded, zero panic, zero jargon. Design in Canva. New download page with email capture (HubSpot form), same modal pattern as the white paper.

### 0.5 Build the nurture sequence *(agent task — HubSpot)*
Four emails over ~10 days for new guide downloads:
1. **Day 0:** Guide delivery + Tony's personal welcome (why Klara exists, one story)
2. **Day 3:** The best young-voices video + "what this generation is telling us"
3. **Day 6:** What we're building (curriculum, guides, grants) and what it costs — transparency builds trust
4. **Day 10:** The Founding 100 invitation — direct, warm, specific ($25/month = one small-group module; counter status; fixed-term option)
Newsletter cadence after the sequence: one useful email every 1–2 weeks (content from the same calendar as social).

### 0.6 Analytics conventions *(agent task)*
UTM scheme for all links (source/medium/campaign), GA4 events aligned with the Meta Pixel events, and a one-page KPI definitions doc so weekly reports are consistent from week one.

---

## 4. Phase 1 — Intelligence (Weeks 2–4, pure agent research)

Four research briefs, each producing a deliverable Tony reviews once.

### 1A. Watering-hole map
Build a scored database of **100–200 places on Facebook/Instagram (plus faith-parenting podcasts and newsletters with FB/IG presence)** where Christians concerned about AI and technology's effect on kids already gather: creators, pages, groups, ministries, Christian media outlets, homeschool networks, church-leader communities.

Scoring rubric (1–5 each):
| Signal | Why it matters |
|---|---|
| Audience fit | Christian parents/grandparents/church leaders vs. general tech audience |
| Engagement quality | Real comments and shares, not just follower count |
| Giving propensity | Audience age/life-stage; churchgoing skew (strongest single predictor of charitable giving); community already funds things (sponsors, Patreon, fundraisers) |
| Topic proximity | Already posting about AI/screens/tech and kids/faith |
| Partnership openness | History of collabs, guest content, sponsorships |

Deliverable: ranked spreadsheet with contact paths (public/business contact info only), top-20 shortlist for Phase 2 outreach.

### 1B. Aggregate listening → message map
Analyze the public conversation in those spaces **in aggregate** (per Guardrail 1): What do Christian parents actually say and fear about AI? What questions do pastors ask? What language do they use ("I don't even know what my kids are using," "is this thing demonic or just a tool," "will my job exist")? What objections arise toward new organizations asking for money?

Deliverable: a message map — top 10 fears/questions in the audience's own words, phrases to use and avoid, objection/response pairs, and 20 content hooks derived from real recurring questions.

### 1C. Peer scan
Map how adjacent organizations (ERLC, Gospel Coalition AI content, Center for Public Justice, Catholic AI initiatives, secular screen-time orgs like Wait Until 8th) message this space, what they ask for, and what lane is open. Deliverable: 2-page positioning brief confirming/refining Klara's differentiation (practical church equipping + next-generation platforming).

### 1D. Young-voices casting kit
Since young people carry the videos:
- Profile: ages 18–25 (18+ keeps consent simple), articulate, genuinely Christian, comfortable on camera; sources: Cornerstone Presbyterian and area churches, Christian college campus ministries (RUF, Cru, InterVarsity), essay-competition early interest, homeschool alumni networks
- Agent drafts: recruiting note Tony sends to pastors/campus staff (outreach to leaders — permitted under guardrails), an interest form, an appearance-release form (have a lawyer glance at it), an interview question bank (30+ prompts: "What do adults get wrong about your generation and AI?" "What are you afraid of?" "Where's God in this for you?"), and a modest thank-you/stipend recommendation

---

## 5. Phase 2 — Content engine + organic launch (Weeks 4–8)

### 2.1 Studio batch #1
One studio session (~half day) with 3–5 young people → 8–12 interview segments → 20–30 short cutdowns (30–90s vertical clips). Two series concepts to start:
- **"Ask Someone Who'll Live With It"** — young Christians answering parents' real questions (sourced from the 1B message map)
- **"The Question Nobody's Asking Me"** — each guest names the conversation they wish adults would have with them
Tony records 2–3 short framing pieces per batch (why Klara exists, what the Founding 100 builds). Repeat monthly.

### 2.2 Content calendar *(recurring agent job)*
4–5 posts/week per platform, agent-drafted in weekly batches, Tony approves in one ~1-hour sitting:
- 2–3 video clips (the engine)
- 1 quote card / stat / scripture-with-commentary (from message map + white paper)
- 1 conversation-starter question post (comments are the goal — Meta rewards them, and replies are Tony's engagement time well spent)
- Every post ends with one consistent CTA: the free Parent's Guide (not the donate page — the funnel does the converting)

### 2.3 Engagement protocol (Tony, time-capped)
- 20–30 minutes/day (or 3 focused sessions/week): reply to comments on Klara posts; participate personally and usefully in 5–10 target groups from the 1A map
- Agents pre-draft reply options for comment threads daily; Tony edits and posts himself (Guardrail 3)
- House rule in groups: be a helpful clinical psychologist and dad first; mention Klara resources only when directly relevant or invited

### 2.4 Creator partnerships *(agent drafts, Tony sends)*
Pitch the top 20 from the 1A shortlist, prioritizing micro-creators (10k–100k followers — better rates, better trust). Offer menu:
- Free: share the Parent's Guide with their audience; a young-voices clip made with/for them; Tony as a live-conversation guest on their page
- Paid (budget $100–500/placement, months 2–3): sponsored post or dedicated share
Target: 3–5 active partnerships by day 90. Track in a simple pipeline sheet (contacted → replied → agreed → live).

### 2.5 Warm-network launch (the real first milestone)
Before any paid spend matters, Tony personally invites his own network — church community, colleagues, friends, family — via a personal email/letter (agent-drafted, Tony-voiced): the story, the ask, the Founding 100. **Target: first 25 founding members from warm circles.** This seeds MRR, the social-proof counter, the email list, and eventually the lookalike audience. Keep SafeSide business lists out of it (separate entity, no consent) — personal relationships only.

---

## 6. Phase 3 — Paid acquisition + conversion loop (Weeks 6–12)

### 3.1 Campaign structure (start $15–30/day total)
- **TOF (top of funnel) — Lead campaign:** best-performing video clips driving Parent's Guide downloads (Meta lead objective, ~$450–700/month). Expect $1.50–4.00 per lead in this niche once creative settles.
- **MOF (retargeting) — Founding 100 campaign:** video viewers (50%+), site visitors, and email list see the membership ask directly (~$150–250/month)
- Creative rotates from the Phase 2 library; 3–4 ad variants live per campaign

### 3.2 Audience stack
- Interests: Christian parenting, Focus on the Family, The Gospel Coalition, homeschooling, church leadership, Christian media outlets — layered with age 30–65, US
- At 500+ emails/donors: **lookalike audiences** seeded from the HubSpot list and donor list — this is the compliant, industrial-strength version of "find more people like the ones who care"
- Google Ad Grant search campaigns (from 0.2) running in parallel at $0 cost

### 3.3 Decision rules (so agents can manage without meetings)
- Kill an ad at $50 spend with zero leads, or CTR < 0.8% after 3 days
- Scale a winner +20% budget every 3 days while CPL < $4
- If email→donor conversion < 1% after 200 sequence completions, rewrite email 4 (the ask) first, then email 1
- If a video format outperforms 2× on cost-per-lead, next studio batch doubles down on it

### 3.4 Weekly metrics loop *(recurring agent job)*
One agent-produced weekly digest: spend, leads, CPL, email list size, sequence conversion rate, new founding members, MRR, counter status, top/bottom creative — plus the single recommended change for next week. Tony reads it in 5 minutes and approves the change.

---

## 7. Recurring agent job briefs (copy-paste prompts)

**Weekly content batch:**
> Using the message map (docs/research/message-map.md), the content calendar template, and this week's clip library, draft next week's 4–5 Facebook and Instagram posts with full copy, hooks, hashtags, and CTA to the Parent's Guide. Match The Klara Project voice: warm, grounded, hopeful, zero panic, zero jargon, scripture used naturally. Output for one-sitting approval.

**Weekly metrics digest:**
> From the pasted Meta Ads, HubSpot, and Stripe numbers, produce the weekly digest per docs/marketing-plan.md §3.4: KPI table vs. last week vs. 90-day targets, top and bottom creative, funnel conversion rates, and exactly one recommended change with rationale. Apply the decision rules in §3.3.

**Monthly listening refresh:**
> Refresh the aggregate listening research (§1B): what new questions, fears, and language are appearing in the mapped communities this month? AGGREGATE ONLY — no named individuals or handles of private people. Update the message map and propose 10 new content hooks.

**Partnership pipeline:**
> Update the creator pipeline sheet: for each shortlisted creator not yet contacted, draft a personalized pitch (Tony's voice, specific reference to their recent content, one clear offer from the §2.4 menu). For pending replies >10 days, draft one polite follow-up. Public/business contact channels only.

**Comment-reply drafting (daily, optional):**
> For each open comment on Klara's posts (pasted below), draft 2 reply options in Tony's voice — warm, substantive, never defensive, question-asking where natural. Tony posts them himself.

---

## 8. Tony's weekly time budget (~4–6 hours)

| Activity | Time |
|---|---|
| Approve weekly content batch | 1 hr |
| Personal engagement (comments + groups) | 1.5–2.5 hrs |
| Studio session (monthly, amortized) | ~1 hr/wk |
| Weekly digest review + one decision | 15 min |
| Partnership emails / warm-network follow-ups | 30–60 min |

## 9. Budget allocation (within $500–1,500/month)

| Item | Monthly |
|---|---|
| Meta ads (TOF + retargeting) | $450–900 |
| Creator placements (from month 2–3) | $0–400 |
| Tools (Canva Pro, CapCut, misc.) | $30–100 |
| Google Ad Grant | $0 (free, up to $10k) |

## 10. 90-day targets

| Metric | Day 30 | Day 60 | Day 90 |
|---|---|---|---|
| Email list | 150–300 (warm launch) | 500–900 | 1,000–2,000 |
| Founding members (monthly donors) | 20–30 (mostly warm) | 35–55 | **50–75** |
| MRR (@ ~$30 avg) | $600–900 | $1,000–1,650 | $1,500–2,250 |
| Creator partnerships live | 0–1 | 2–3 | 3–5 |
| Video clips in library | 20–30 | 40–60 | 60–90 |

Reaching 100 founding members by roughly month 5 is the realistic path; hitting 100 inside 90 days would require the warm network and one creator partnership to overperform — possible, not the plan's promise. When the counter hits 100, the campaign graduates: "Founding 100 complete — join the next 500."

## 11. Sequencing summary (what to hand agents, in order)

1. §0.1 site tax-language update + §0.2 Meta Pixel install *(this repo, immediately)*
2. §0.3 Founding 100 site/HubSpot build + §0.4 Parent's Guide draft + §0.5 nurture emails
3. §1A–1D research briefs *(parallel, pure agent work)*
4. Tony: §0.2 account creation, §1D recruiting sends, §2.5 warm-network letter
5. §2.1 studio batch → §2.2 calendar live → §2.4 partnership pitches
6. §3.1 ads live once Pixel has data and 2 weeks of organic creative signal
7. Recurring jobs (§7) from week 4 onward
