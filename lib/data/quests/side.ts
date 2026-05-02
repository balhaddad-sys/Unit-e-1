/**
 * Wasta · Data: Side Quest Templates
 * Procedurally-generated location errands.
 *
 * STATUS: Templates only. The procedural generator lives in
 * /lib/engine/sideQuestGen.ts (Phase 2).
 */

import type { SideQuestTemplate } from "@/lib/types";

export const sideQuestTemplates: SideQuestTemplate[] = [
  // ─── DIWANIYA ─────────────────────────────────────────────────
  {
    id: "diwaniya_meeting",
    zone: "diwaniya",
    title: "تنسيق قعدة",
    desc: "رتّب موعد بين أم نصر وتاجر مهم. اختر الوقت المناسب.",
    need: 3,
    reward: { wasta: 3, money: 105, rep: 2 },
  },
  {
    id: "diwaniya_info",
    zone: "diwaniya",
    title: "خبر من الديوانية",
    desc: "اجمع معلومات عن صفقة عقارية مذكورة بصمت.",
    need: 4,
    reward: { wasta: 4, money: 140, rep: 3 },
  },

  // ─── SOUQ ─────────────────────────────────────────────────────
  {
    id: "souq_delivery",
    zone: "souq",
    title: "توصيل أمانة",
    desc: "وصّل صرة لمبارك الحواج بدون ما تفتحها.",
    need: 2,
    reward: { wasta: 2, money: 70, rep: 1 },
  },
  {
    id: "souq_dispute",
    zone: "souq",
    title: "خلاف بين تاجرين",
    desc: "وسّط بين تاجرين على بسطة مشتركة.",
    need: 3,
    reward: { wasta: 3, money: 100, rep: 2 },
  },

  // ─── CITY ─────────────────────────────────────────────────────
  {
    id: "city_signature",
    zone: "city",
    title: "توقيع حساس",
    desc: "حصّل توقيع من الشيخة لطيفة قبل ما ينتهي الوقت.",
    need: 4,
    reward: { wasta: 4, money: 150, rep: 3 },
  },

  // ─── GOVZONE ──────────────────────────────────────────────────
  {
    id: "gov_paperwork",
    zone: "govzone",
    title: "ورقة تايهة",
    desc: "دور على ملف معاملات ضايع في الإدارة.",
    need: 3,
    reward: { wasta: 3, money: 90, rep: 2 },
  },

  // ─── DESERT ───────────────────────────────────────────────────
  {
    id: "desert_camp",
    zone: "desert",
    title: "تحضير المخيم",
    desc: "ساعد ناصر يجهز المخيم لقعدة الخميس.",
    need: 3,
    reward: { wasta: 2, money: 60, rep: 3 },
  },

  // ─── AVENUES ──────────────────────────────────────────────────
  {
    id: "avenues_brand",
    zone: "avenues",
    title: "تعريف لدلال",
    desc: "اعمل تعريف بين دلال ومدير محل برند.",
    need: 2,
    reward: { wasta: 4, money: 120, rep: 2 },
  },
];
