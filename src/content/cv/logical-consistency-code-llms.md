---
title: On the Logical (In)consistency of Code-generating LLMs
summary: Testing whether syntactically valid generated code also remains logically consistent.
date: 2025-01-01
category: Publication
---

Generative programming assistants are usually evaluated through syntax and execution-based benchmarks. This work studies a narrower but important question: whether syntactically correct generated code is logically consistent under simple inversion tasks.

Five lightweight language models were evaluated using real-world Python samples from CodeSearchNet. The results show meaningful differences between models, including models designed specifically for code generation. Prompt context also matters: including comments or surrounding code can reduce performance on the logical consistency task.

The study connects logical consistency results with EvalPlus@1 and highlights a remaining weakness in handling simple reasoning operations and contextual information.

**Authors:** Ke Dong, William Hsu, Pascal Hitzler, and Eugene Y. Vasserman  
**Venue:** 2nd Workshop on Generative and Neurosymbolic AI in Software Engineering (GenSE 2025), Software Engineering 2025 Companion Proceedings  
**DOI:** [10.18420/SE2025-WS-12](https://doi.org/10.18420/SE2025-WS-12)  
**PDF:** [Read the paper](/papers/codeLogic_2025.pdf)
