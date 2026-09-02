# Ship playbook — keep tracks separate

Topic changes every week. OCD and BPD are examples only.

## Track A — preceptee quizzes
URL pattern: `https://www.yuriybortnik.com/{topic}quiz`
Example: `https://www.yuriybortnik.com/bpdquiz`
Wix page on the practice site. Do not invent a new quiz subdomain unless he asks.
Existing live exception: `https://ocdquiz.yuriybortnik.com` stays as-is. Do not migrate it in passing.
Clone the ocdquiz *shell* only. New GitHub repo every week. Do not reuse `preceptee-ocd-quiz` or `preceptee-bpd-quiz`.

## Track B — clinic patient screeners
URL pattern: `{short}scr1.yuriybortnik.com`
Example: `https://ocdscr1.yuriybortnik.com`
Wix DNS CNAME `{short}scr1` → `bortniky-dotcom.github.io`
Do not bind that CNAME to the Wix practice site.
Clone `childhood-adhd-screener`. New public repo per instrument.

Never put quiz rules in a screener chat or screener rules in a quiz chat.
