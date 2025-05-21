"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Customer, ConsultationForm } from "@/types/customer";
import { v4 as uuidv4 } from "uuid";

// Sample data for initial customers
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Abbe Humphries",
    mobile: "07858868513",
    email: "abberh@hotmail.co.uk",
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
    lastVisit: new Date(2025, 3, 1),
    consultationFormId: "cf1",
    notes: "",
    active: true,
  },
  {
    id: "c2",
    name: "Alexandra Theohari",
    mobile: "07939254299",
    email: "alexdoukaz@yahoo.co.uk",
    createdAt: new Date(2024, 0, 2),
    updatedAt: new Date(2024, 0, 2),
    lastVisit: new Date(2025, 3, 2),
    consultationFormId: "cf2",
    notes: "",
    active: true,
  },
  {
    id: "c3",
    name: "Alison Coulson",
    mobile: "07775644769",
    email: "spiceyali1963@gmail.com",
    createdAt: new Date(2024, 0, 3),
    updatedAt: new Date(2024, 0, 3),
    lastVisit: new Date(2025, 3, 3),
    consultationFormId: "cf3",
    notes: "",
    active: true,
  },
  {
    id: "c4",
    name: "Amanda Biollo",
    mobile: "07930305837",
    email: "amandabiollo@blueyonder.co.uk",
    createdAt: new Date(2024, 0, 4),
    updatedAt: new Date(2024, 0, 4),
    lastVisit: new Date(2025, 3, 4),
    consultationFormId: "cf4",
    notes: "",
    active: true,
  },
  {
    id: "c5",
    name: "Anne Berry",
    mobile: "07790945808",
    email: "whitethorn36@gmail.com",
    createdAt: new Date(2024, 0, 5),
    updatedAt: new Date(2024, 0, 5),
    lastVisit: new Date(2025, 3, 5),
    consultationFormId: "cf5",
    notes: "",
    active: true,
  },
  {
    id: "c6",
    name: "Arfan Aslam",
    mobile: "07957340653",
    email: "arfan_aslam77@hotmail.com",
    createdAt: new Date(2024, 0, 6),
    updatedAt: new Date(2024, 0, 6),
    lastVisit: new Date(2025, 3, 6),
    consultationFormId: "cf6",
    notes: "",
    active: true,
  },
  {
    id: "c7",
    name: "Arwen Mirgan",
    mobile: "07855058889",
    email: "armor1975@googlemail.com",
    createdAt: new Date(2024, 0, 7),
    updatedAt: new Date(2024, 0, 7),
    lastVisit: new Date(2025, 3, 7),
    consultationFormId: "cf7",
    notes: "",
    active: true,
  },
  {
    id: "c8",
    name: "Barbara Martin",
    mobile: "07738597906",
    email: "barbaraalterlevel@hotmail.com",
    createdAt: new Date(2024, 0, 8),
    updatedAt: new Date(2024, 0, 8),
    lastVisit: new Date(2025, 3, 8),
    consultationFormId: "cf8",
    notes: "",
    active: true,
  },
  {
    id: "c9",
    name: "Bernadette Togher",
    mobile: "07866686107",
    email: "bernie.togher@btinternet.com",
    createdAt: new Date(2024, 0, 9),
    updatedAt: new Date(2024, 0, 9),
    lastVisit: new Date(2025, 3, 9),
    consultationFormId: "cf9",
    notes: "",
    active: true,
  },
  {
    id: "c10",
    name: "Bianca Drakes",
    mobile: "07958948777",
    email: "biancadrakes@hotmail.com",
    createdAt: new Date(2024, 0, 10),
    updatedAt: new Date(2024, 0, 10),
    lastVisit: new Date(2025, 3, 10),
    consultationFormId: "cf10",
    notes: "",
    active: true,
  },
  {
    id: "c11",
    name: "Burcu Demir",
    mobile: "07415055495",
    email: "burcudemir@hotmail.co.uk",
    createdAt: new Date(2024, 0, 11),
    updatedAt: new Date(2024, 0, 11),
    lastVisit: new Date(2025, 3, 11),
    consultationFormId: "cf11",
    notes: "",
    active: true,
  },
  {
    id: "c12",
    name: "Carla Johnson",
    mobile: "07415995558",
    email: "carlajohnson99@gmail.com",
    createdAt: new Date(2024, 0, 12),
    updatedAt: new Date(2024, 0, 12),
    lastVisit: new Date(2025, 3, 12),
    consultationFormId: "cf12",
    notes: "",
    active: true,
  },
  {
    id: "c13",
    name: "Carol Bramble",
    mobile: "07966191734",
    email: "carol.bramble@googlemail.com",
    createdAt: new Date(2024, 0, 13),
    updatedAt: new Date(2024, 0, 13),
    lastVisit: new Date(2025, 3, 13),
    consultationFormId: "cf13",
    notes: "",
    active: true,
  },
  {
    id: "c14",
    name: "Catherine Doulias",
    mobile: "07740457411",
    email: "cdoulias@yahoo.co.uk",
    createdAt: new Date(2024, 0, 14),
    updatedAt: new Date(2024, 0, 14),
    lastVisit: new Date(2025, 3, 14),
    consultationFormId: "cf14",
    notes: "",
    active: true,
  },
  {
    id: "c15",
    name: "Cathy Walsh",
    mobile: "07798642272",
    email: "cathy.walsh1@btinternet.com",
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 15),
    lastVisit: new Date(2025, 3, 15),
    consultationFormId: "cf15",
    notes: "",
    active: true,
  },
  {
    id: "c16",
    name: "Chrissie Dobson",
    mobile: "07970299695",
    email: "chrissiedob@yahoo.co.uk",
    createdAt: new Date(2024, 0, 16),
    updatedAt: new Date(2024, 0, 16),
    lastVisit: new Date(2025, 3, 16),
    consultationFormId: "cf16",
    notes: "",
    active: true,
  },
  {
    id: "c17",
    name: "Christianna Charalambous",
    mobile: "07399571801",
    email: "christiannachara@gmail.com",
    createdAt: new Date(2024, 0, 17),
    updatedAt: new Date(2024, 0, 17),
    lastVisit: new Date(2025, 3, 17),
    consultationFormId: "cf17",
    notes: "",
    active: true,
  },
  {
    id: "c18",
    name: "Christina Kaya",
    mobile: "07808962649",
    email: "christinakaya68@hotmail.co.uk",
    createdAt: new Date(2024, 0, 18),
    updatedAt: new Date(2024, 0, 18),
    lastVisit: new Date(2025, 3, 18),
    consultationFormId: "cf18",
    notes: "",
    active: true,
  },
  {
    id: "c19",
    name: "Claire Sawyer",
    mobile: "07951439775",
    email: "beautmont@sky.com",
    createdAt: new Date(2024, 0, 19),
    updatedAt: new Date(2024, 0, 19),
    lastVisit: new Date(2025, 3, 19),
    consultationFormId: "cf19",
    notes: "",
    active: true,
  },
  {
    id: "c20",
    name: "Cobi Campbell",
    mobile: "07946423589",
    email: "campbellcobi@gmail.com",
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 0, 20),
    lastVisit: new Date(2025, 3, 20),
    consultationFormId: "cf20",
    notes: "",
    active: true,
  },
  {
    id: "c21",
    name: "Daniel Cole",
    mobile: "07764534682",
    email: "cole_10@ymail.com",
    createdAt: new Date(2024, 0, 21),
    updatedAt: new Date(2024, 0, 21),
    lastVisit: new Date(2025, 3, 21),
    consultationFormId: "cf21",
    notes: "",
    active: true,
  },
  {
    id: "c22",
    name: "Dawn Spano",
    mobile: "06969819120",
    email: "dawnspano@googlemail.com",
    createdAt: new Date(2024, 0, 22),
    updatedAt: new Date(2024, 0, 22),
    lastVisit: new Date(2025, 3, 22),
    consultationFormId: "cf22",
    notes: "",
    active: true,
  },
  {
    id: "c23",
    name: "Deb Askey",
    mobile: "07790686302",
    email: "deb.askey@btinternet.com",
    createdAt: new Date(2024, 0, 23),
    updatedAt: new Date(2024, 0, 23),
    lastVisit: new Date(2025, 3, 23),
    consultationFormId: "cf23",
    notes: "",
    active: true,
  },
  {
    id: "c24",
    name: "Deborah Adams",
    mobile: "07961300870",
    email: "debzy050@gmail.com",
    createdAt: new Date(2024, 0, 24),
    updatedAt: new Date(2024, 0, 24),
    lastVisit: new Date(2025, 3, 24),
    consultationFormId: "cf24",
    notes: "",
    active: true,
  },
  {
    id: "c25",
    name: "Denise Riaz",
    mobile: "07931286975",
    email: "driaz@live.co.uk",
    createdAt: new Date(2024, 0, 25),
    updatedAt: new Date(2024, 0, 25),
    lastVisit: new Date(2025, 3, 25),
    consultationFormId: "cf25",
    notes: "",
    active: true,
  },
  {
    id: "c26",
    name: "Dina Patel",
    mobile: "07545887485",
    email: "dina6@me.com",
    createdAt: new Date(2024, 0, 26),
    updatedAt: new Date(2024, 0, 26),
    lastVisit: new Date(2025, 3, 26),
    consultationFormId: "cf26",
    notes: "",
    active: true,
  },
  {
    id: "c27",
    name: "Dino Lazarides",
    mobile: "07967395572",
    email: "dinolazarides@gmail.com",
    createdAt: new Date(2024, 0, 27),
    updatedAt: new Date(2024, 0, 27),
    lastVisit: new Date(2025, 3, 27),
    consultationFormId: "cf27",
    notes: "",
    active: true,
  },
  {
    id: "c28",
    name: "Dionne Butler",
    mobile: "07496371340",
    email: "dionnebutler90@hotmail.com",
    createdAt: new Date(2024, 0, 28),
    updatedAt: new Date(2024, 0, 28),
    lastVisit: new Date(2025, 3, 28),
    consultationFormId: "cf28",
    notes: "",
    active: true,
  },
  {
    id: "c29",
    name: "Dominic Remzi",
    mobile: "07830717997",
    email: "angelatobon100@hotmail.com",
    createdAt: new Date(2024, 0, 29),
    updatedAt: new Date(2024, 0, 29),
    lastVisit: new Date(2025, 3, 29),
    consultationFormId: "cf29",
    notes: "",
    active: true,
  },
  {
    id: "c30",
    name: "Donna Jones",
    mobile: "07917688666",
    email: "donna_jonesy@hotmail.co.uk",
    createdAt: new Date(2024, 0, 30),
    updatedAt: new Date(2024, 0, 30),
    lastVisit: new Date(2025, 3, 30),
    consultationFormId: "cf30",
    notes: "",
    active: true,
  },
  {
    id: "c31",
    name: "Donna Twitchings",
    mobile: "07970936254",
    email: "twitchi2@btinternet.com",
    createdAt: new Date(2024, 0, 31),
    updatedAt: new Date(2024, 0, 31),
    lastVisit: new Date(2025, 3, 31),
    consultationFormId: "cf31",
    notes: "",
    active: true,
  },
  {
    id: "c32",
    name: "Elaine Barber",
    mobile: "07801341378",
    email: "ejebarber@gmail.com",
    createdAt: new Date(2024, 1, 1),
    updatedAt: new Date(2024, 1, 1),
    lastVisit: new Date(2025, 4, 1),
    consultationFormId: "cf32",
    notes: "",
    active: true,
  },
  {
    id: "c33",
    name: "Eleni Christodoulou",
    mobile: "07985278274",
    email: "eleni1978@hotmail.co.uk",
    createdAt: new Date(2024, 1, 2),
    updatedAt: new Date(2024, 1, 2),
    lastVisit: new Date(2025, 4, 2),
    consultationFormId: "cf33",
    notes: "",
    active: true,
  },
  {
    id: "c34",
    name: "Ellie Betts-Cooper",
    mobile: "07890519201",
    email: "ellie.betts@live.co.uk",
    createdAt: new Date(2024, 1, 3),
    updatedAt: new Date(2024, 1, 3),
    lastVisit: new Date(2025, 4, 3),
    consultationFormId: "cf34",
    notes: "",
    active: true,
  },
  {
    id: "c35",
    name: "Ellie Marcangelo",
    mobile: "07581683813",
    email: "marcangellos@hotmail.co.uk",
    createdAt: new Date(2024, 1, 4),
    updatedAt: new Date(2024, 1, 4),
    lastVisit: new Date(2025, 4, 4),
    consultationFormId: "cf35",
    notes: "",
    active: true,
  },
  {
    id: "c36",
    name: "Ellis Hobbs",
    mobile: "07981431089",
    email: "ellishobbs01@hotmail.co.uk",
    createdAt: new Date(2024, 1, 5),
    updatedAt: new Date(2024, 1, 5),
    lastVisit: new Date(2025, 4, 5),
    consultationFormId: "cf36",
    notes: "",
    active: true,
  },
  {
    id: "c37",
    name: "Emily Maguire",
    mobile: "07972058679",
    email: "emaguire47@icloud.com",
    createdAt: new Date(2024, 1, 6),
    updatedAt: new Date(2024, 1, 6),
    lastVisit: new Date(2025, 4, 6),
    consultationFormId: "cf37",
    notes: "",
    active: true,
  },
  {
    id: "c38",
    name: "Emma-Louise Follows",
    mobile: "07791354983",
    email: "emma-lou@eatlive.co.uk",
    createdAt: new Date(2024, 1, 7),
    updatedAt: new Date(2024, 1, 7),
    lastVisit: new Date(2025, 4, 7),
    consultationFormId: "cf38",
    notes: "",
    active: true,
  },
  {
    id: "c39",
    name: "Erica Finch",
    mobile: "07859934276",
    email: "ericafinch1@hotmail.com",
    createdAt: new Date(2024, 1, 8),
    updatedAt: new Date(2024, 1, 8),
    lastVisit: new Date(2025, 4, 8),
    consultationFormId: "cf39",
    notes: "",
    active: true,
  },
  {
    id: "c40",
    name: "Franca Roberts",
    mobile: "07415700263",
    email: "francabongiorno@hotmail.com",
    createdAt: new Date(2024, 1, 9),
    updatedAt: new Date(2024, 1, 9),
    lastVisit: new Date(2025, 4, 9),
    consultationFormId: "cf40",
    notes: "",
    active: true,
  },
  {
    id: "c41",
    name: "Gina Culora",
    mobile: "07973144857",
    email: "gculora@yahoo.co.uk",
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 1, 10),
    lastVisit: new Date(2025, 4, 10),
    consultationFormId: "cf41",
    notes: "",
    active: true,
  },
  {
    id: "c42",
    name: "Henar Ampudia",
    mobile: "07920728806",
    email: "henarampudia@hotmail.com",
    createdAt: new Date(2024, 1, 11),
    updatedAt: new Date(2024, 1, 11),
    lastVisit: new Date(2025, 4, 11),
    consultationFormId: "cf42",
    notes: "",
    active: true,
  },
  {
    id: "c43",
    name: "Iffi Sozou",
    mobile: "07956367840",
    email: "iffisozou@hotmail.co.uk",
    createdAt: new Date(2024, 1, 12),
    updatedAt: new Date(2024, 1, 12),
    lastVisit: new Date(2025, 4, 12),
    consultationFormId: "cf43",
    notes: "",
    active: true,
  },
  {
    id: "c44",
    name: "Inge Massiah",
    mobile: "07958948777",
    email: "biancadrakes@hotmail.com",
    createdAt: new Date(2024, 1, 13),
    updatedAt: new Date(2024, 1, 13),
    lastVisit: new Date(2025, 4, 13),
    consultationFormId: "cf44",
    notes: "",
    active: true,
  },
  {
    id: "c45",
    name: "Isioma Peters",
    mobile: "07583179884",
    email: "isiomapeters@yahoo.com",
    createdAt: new Date(2024, 1, 14),
    updatedAt: new Date(2024, 1, 14),
    lastVisit: new Date(2025, 4, 14),
    consultationFormId: "cf45",
    notes: "",
    active: true,
  },
  {
    id: "c46",
    name: "Jane Howlett",
    mobile: "07966310590",
    email: "jane.howlett@blueyonder.co.uk",
    createdAt: new Date(2024, 1, 15),
    updatedAt: new Date(2024, 1, 15),
    lastVisit: new Date(2025, 4, 15),
    consultationFormId: "cf46",
    notes: "",
    active: true,
  },
  {
    id: "c47",
    name: "Jane Clapham",
    mobile: "07825654927",
    email: "janeclapham@btinternet.com",
    createdAt: new Date(2024, 1, 16),
    updatedAt: new Date(2024, 1, 16),
    lastVisit: new Date(2025, 4, 16),
    consultationFormId: "cf47",
    notes: "",
    active: true,
  },
  {
    id: "c48",
    name: "Janet Nicolaou",
    mobile: "07834919621",
    email: "janetnicolaou1964@gmail.com",
    createdAt: new Date(2024, 1, 17),
    updatedAt: new Date(2024, 1, 17),
    lastVisit: new Date(2025, 4, 17),
    consultationFormId: "cf48",
    notes: "",
    active: true,
  },
  {
    id: "c49",
    name: "Janine Patel",
    mobile: "07595358433",
    email: "janinepatel@me.com",
    createdAt: new Date(2024, 1, 18),
    updatedAt: new Date(2024, 1, 18),
    lastVisit: new Date(2025, 4, 18),
    consultationFormId: "cf49",
    notes: "",
    active: true,
  },
  {
    id: "c50",
    name: "Julia Christou",
    mobile: "07507188965",
    email: "julialeopard@yahoo.com",
    createdAt: new Date(2024, 1, 19),
    updatedAt: new Date(2024, 1, 19),
    lastVisit: new Date(2025, 4, 19),
    consultationFormId: "cf50",
    notes: "",
    active: true,
  },
  {
    id: "c51",
    name: "June Nelson",
    mobile: "07976829645",
    email: "jnelson1000@btopenworld.com",
    createdAt: new Date(2024, 1, 20),
    updatedAt: new Date(2024, 1, 20),
    lastVisit: new Date(2025, 4, 20),
    consultationFormId: "cf51",
    notes: "",
    active: true,
  },
  {
    id: "c52",
    name: "Katerina Philona",
    mobile: "07903453482",
    email: "katerinaphilona@hotmail.com",
    createdAt: new Date(2024, 1, 21),
    updatedAt: new Date(2024, 1, 21),
    lastVisit: new Date(2025, 4, 21),
    consultationFormId: "cf52",
    notes: "",
    active: true,
  },
  {
    id: "c53",
    name: "Kathy Marcangelo",
    mobile: "07973656217",
    email: "marcangelokathy@gmail.com",
    createdAt: new Date(2024, 1, 22),
    updatedAt: new Date(2024, 1, 22),
    lastVisit: new Date(2025, 4, 22),
    consultationFormId: "cf53",
    notes: "",
    active: true,
  },
  {
    id: "c54",
    name: "Keeley Caterer",
    mobile: "07940126360",
    email: "keeleyleopold@hotmail.co.uk",
    createdAt: new Date(2024, 1, 23),
    updatedAt: new Date(2024, 1, 23),
    lastVisit: new Date(2025, 4, 23),
    consultationFormId: "cf54",
    notes: "",
    active: true,
  },
  {
    id: "c55",
    name: "Kellyann Meighan",
    mobile: "07859002126",
    email: "kellymeighan@hotmail.co.uk",
    createdAt: new Date(2024, 1, 24),
    updatedAt: new Date(2024, 1, 24),
    lastVisit: new Date(2025, 4, 24),
    consultationFormId: "cf55",
    notes: "",
    active: true,
  },
  {
    id: "c56",
    name: "Kleo Papa",
    mobile: "07956132615",
    email: "kleopapa@yahoo.co.uk",
    createdAt: new Date(2024, 1, 25),
    updatedAt: new Date(2024, 1, 25),
    lastVisit: new Date(2025, 4, 25),
    consultationFormId: "cf56",
    notes: "",
    active: true,
  },
  {
    id: "c57",
    name: "Kyri Athanasiou",
    mobile: "07584021886",
    email: "kyriakiathanasiou@outlook.com",
    createdAt: new Date(2024, 1, 26),
    updatedAt: new Date(2024, 1, 26),
    lastVisit: new Date(2025, 4, 26),
    consultationFormId: "cf57",
    notes: "",
    active: true,
  },
  {
    id: "c58",
    name: "Laura Matteobi",
    mobile: "07729985469",
    email: "laura_matteobi@live.co.uk",
    createdAt: new Date(2024, 1, 27),
    updatedAt: new Date(2024, 1, 27),
    lastVisit: new Date(2025, 4, 27),
    consultationFormId: "cf58",
    notes: "",
    active: true,
  },
  {
    id: "c59",
    name: "Lauran",
    mobile: "07842226966",
    email: "l4100per@sky.com",
    createdAt: new Date(2024, 1, 28),
    updatedAt: new Date(2024, 1, 28),
    lastVisit: new Date(2025, 4, 28),
    consultationFormId: "cf59",
    notes: "",
    active: true,
  },
  {
    id: "c60",
    name: "Leanne Head",
    mobile: "07850917618",
    email: "leannejane11@hotmail.co.uk",
    createdAt: new Date(2024, 1, 29),
    updatedAt: new Date(2024, 1, 29),
    lastVisit: new Date(2025, 4, 29),
    consultationFormId: "cf60",
    notes: "",
    active: true,
  },
  {
    id: "c61",
    name: "Linda Lovett",
    mobile: "07940720403",
    email: "lovettlinda00@gmail.com",
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 2, 1),
    lastVisit: new Date(2025, 5, 1),
    consultationFormId: "cf61",
    notes: "",
    active: true,
  },
  {
    id: "c62",
    name: "Lisa Demosthenous",
    mobile: "07766105451",
    email: "litsdemos403@gmail.com",
    createdAt: new Date(2024, 2, 2),
    updatedAt: new Date(2024, 2, 2),
    lastVisit: new Date(2025, 5, 2),
    consultationFormId: "cf62",
    notes: "",
    active: true,
  },
  {
    id: "c63",
    name: "Lorraine Colley",
    mobile: "07951904423",
    email: "lorrainecolley@hotmail.com",
    createdAt: new Date(2024, 2, 3),
    updatedAt: new Date(2024, 2, 3),
    lastVisit: new Date(2025, 5, 3),
    consultationFormId: "cf63",
    notes: "",
    active: true,
  },
  {
    id: "c64",
    name: "Lottie Stewart",
    mobile: "07872845739",
    email: "lottie29@icloud.com",
    createdAt: new Date(2024, 2, 4),
    updatedAt: new Date(2024, 2, 4),
    lastVisit: new Date(2025, 5, 4),
    consultationFormId: "cf64",
    notes: "",
    active: true,
  },
  {
    id: "c65",
    name: "Lynn Hurrell",
    mobile: "07957594074",
    email: "lynnbeels2@hotmail.co.uk",
    createdAt: new Date(2024, 2, 5),
    updatedAt: new Date(2024, 2, 5),
    lastVisit: new Date(2025, 5, 5),
    consultationFormId: "cf65",
    notes: "",
    active: true,
  },
  {
    id: "c66",
    name: "Maria Christoforou",
    mobile: "07940586715",
    email: "info@hargeo.com",
    createdAt: new Date(2024, 2, 6),
    updatedAt: new Date(2024, 2, 6),
    lastVisit: new Date(2025, 5, 6),
    consultationFormId: "cf66",
    notes: "",
    active: true,
  },
  {
    id: "c67",
    name: "Mark Philip Bond",
    mobile: "07851723121",
    email: "markyboy5025@hotmail.com",
    createdAt: new Date(2024, 2, 7),
    updatedAt: new Date(2024, 2, 7),
    lastVisit: new Date(2025, 5, 7),
    consultationFormId: "cf67",
    notes: "",
    active: true,
  },
  {
    id: "c68",
    name: "Marnie Gilmour",
    mobile: "07738582759",
    email: "Gilmour931@btinternet.com",
    createdAt: new Date(2024, 2, 8),
    updatedAt: new Date(2024, 2, 8),
    lastVisit: new Date(2025, 5, 8),
    consultationFormId: "cf68",
    notes: "",
    active: true,
  },
  {
    id: "c69",
    name: "Martine Wright",
    mobile: "07970054349",
    email: "happychic@hotmail.co.uk",
    createdAt: new Date(2024, 2, 9),
    updatedAt: new Date(2024, 2, 9),
    lastVisit: new Date(2025, 5, 9),
    consultationFormId: "cf69",
    notes: "",
    active: true,
  },
  {
    id: "c70",
    name: "Michael Gavriel",
    mobile: "07759069125",
    email: "michaelgavriel@yahoo.co.uk",
    createdAt: new Date(2024, 2, 10),
    updatedAt: new Date(2024, 2, 10),
    lastVisit: new Date(2025, 5, 10),
    consultationFormId: "cf70",
    notes: "",
    active: true,
  },
  {
    id: "c71",
    name: "Michelle Martin",
    mobile: "07814664120",
    email: "michellecarolan69@gmail.com",
    createdAt: new Date(2024, 2, 11),
    updatedAt: new Date(2024, 2, 11),
    lastVisit: new Date(2025, 5, 11),
    consultationFormId: "cf71",
    notes: "",
    active: true,
  },
  {
    id: "c72",
    name: "Monica Gomes",
    mobile: "07903634933",
    email: "monicagomesyouens@gmail.com",
    createdAt: new Date(2024, 2, 12),
    updatedAt: new Date(2024, 2, 12),
    lastVisit: new Date(2025, 5, 12),
    consultationFormId: "cf72",
    notes: "",
    active: true,
  },
  {
    id: "c73",
    name: "Nancy Armstrong",
    mobile: "07951246926",
    email: "njarmstrong1965@gmail.com",
    createdAt: new Date(2024, 2, 13),
    updatedAt: new Date(2024, 2, 13),
    lastVisit: new Date(2025, 5, 13),
    consultationFormId: "cf73",
    notes: "",
    active: true,
  },
  {
    id: "c74",
    name: "Natalie Stewart",
    mobile: "07967825186",
    email: "sonny_345@hotmail.co.uk",
    createdAt: new Date(2024, 2, 14),
    updatedAt: new Date(2024, 2, 14),
    lastVisit: new Date(2025, 5, 14),
    consultationFormId: "cf74",
    notes: "",
    active: true,
  },
  {
    id: "c75",
    name: "Natalie Ahern",
    mobile: "07980512472",
    email: "nahern@live.co.uk",
    createdAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 2, 15),
    lastVisit: new Date(2025, 5, 15),
    consultationFormId: "cf75",
    notes: "",
    active: true,
  },
  {
    id: "c76",
    name: "Nicola De Freitas",
    mobile: "07539341698",
    email: "niclisa@hotmail.co.uk",
    createdAt: new Date(2024, 2, 16),
    updatedAt: new Date(2024, 2, 16),
    lastVisit: new Date(2025, 5, 16),
    consultationFormId: "cf76",
    notes: "",
    active: true,
  },
  {
    id: "c77",
    name: "Nicole Horne",
    mobile: "07960859247",
    email: "nicoleantoniou@hotmail.com",
    createdAt: new Date(2024, 2, 17),
    updatedAt: new Date(2024, 2, 17),
    lastVisit: new Date(2025, 5, 17),
    consultationFormId: "cf77",
    notes: "",
    active: true,
  },
  {
    id: "c78",
    name: "Olivia Doulias",
    mobile: "07734221073",
    email: "odoulias@hotmail.co.uk",
    createdAt: new Date(2024, 2, 18),
    updatedAt: new Date(2024, 2, 18),
    lastVisit: new Date(2025, 5, 18),
    consultationFormId: "cf78",
    notes: "",
    active: true,
  },
  {
    id: "c79",
    name: "Ozlem Ermet",
    mobile: "07506032996",
    email: "ozlemsermet@hotmail.com",
    createdAt: new Date(2024, 2, 19),
    updatedAt: new Date(2024, 2, 19),
    lastVisit: new Date(2025, 5, 19),
    consultationFormId: "cf79",
    notes: "",
    active: true,
  },
  {
    id: "c80",
    name: "Phillippa Denise",
    mobile: "07946475164",
    email: "Phillippad@aol.com",
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
    lastVisit: new Date(2025, 5, 20),
    consultationFormId: "cf80",
    notes: "",
    active: true,
  },
  {
    id: "c81",
    name: "Rachel Archer",
    mobile: "07960429080",
    email: "rachel1973archer@gmail.com",
    createdAt: new Date(2024, 2, 21),
    updatedAt: new Date(2024, 2, 21),
    lastVisit: new Date(2025, 5, 21),
    consultationFormId: "cf81",
    notes: "",
    active: true,
  },
  {
    id: "c82",
    name: "Rachel Freeman",
    mobile: "07950290330",
    email: "rachelfreeman@live.co.uk",
    createdAt: new Date(2024, 2, 22),
    updatedAt: new Date(2024, 2, 22),
    lastVisit: new Date(2025, 5, 22),
    consultationFormId: "cf82",
    notes: "",
    active: true,
  },
  {
    id: "c83",
    name: "Rajpreet Sondh",
    mobile: "07944860033",
    email: "rks__@hotmail.com",
    createdAt: new Date(2024, 2, 23),
    updatedAt: new Date(2024, 2, 23),
    lastVisit: new Date(2025, 5, 23),
    consultationFormId: "cf83",
    notes: "",
    active: true,
  },
  {
    id: "c84",
    name: "Rebecca Vargas",
    mobile: "07904390262",
    email: "rebeccavargas@hotmail.co.uk",
    createdAt: new Date(2024, 2, 24),
    updatedAt: new Date(2024, 2, 24),
    lastVisit: new Date(2025, 5, 24),
    consultationFormId: "cf84",
    notes: "",
    active: true,
  },
  {
    id: "c85",
    name: "Ruth Gosling",
    mobile: "07971572287",
    email: "ruth.gosling@btinternet.com",
    createdAt: new Date(2024, 2, 25),
    updatedAt: new Date(2024, 2, 25),
    lastVisit: new Date(2025, 5, 25),
    consultationFormId: "cf85",
    notes: "",
    active: true,
  },
  {
    id: "c86",
    name: "Sadie Gilmour",
    mobile: "07738582759",
    email: "Gilmour931@btinternet.com",
    createdAt: new Date(2024, 2, 26),
    updatedAt: new Date(2024, 2, 26),
    lastVisit: new Date(2025, 5, 26),
    consultationFormId: "cf86",
    notes: "",
    active: true,
  },
  {
    id: "c87",
    name: "Samantha Tuite",
    mobile: "07708138746",
    email: "sam.tuite@icloud.com",
    createdAt: new Date(2024, 2, 27),
    updatedAt: new Date(2024, 2, 27),
    lastVisit: new Date(2025, 5, 27),
    consultationFormId: "cf87",
    notes: "",
    active: true,
  },
  {
    id: "c88",
    name: "Sandra Drakes",
    mobile: "07500865502",
    email: "sdrakes24@gmail.com",
    createdAt: new Date(2024, 2, 28),
    updatedAt: new Date(2024, 2, 28),
    lastVisit: new Date(2025, 5, 28),
    consultationFormId: "cf88",
    notes: "",
    active: true,
  },
  {
    id: "c89",
    name: "Sarah Hintz",
    mobile: "07944902937",
    email: "hintzfamily@hotmail.co.uk",
    createdAt: new Date(2024, 2, 29),
    updatedAt: new Date(2024, 2, 29),
    lastVisit: new Date(2025, 5, 29),
    consultationFormId: "cf89",
    notes: "",
    active: true,
  },
  {
    id: "c90",
    name: "Sarah Farman",
    mobile: "07891127011",
    email: "algerfamily@btinternet.com",
    createdAt: new Date(2024, 2, 30),
    updatedAt: new Date(2024, 2, 30),
    lastVisit: new Date(2025, 5, 30),
    consultationFormId: "cf90",
    notes: "",
    active: true,
  },
  {
    id: "c91",
    name: "Savanna Antonia Kelly-Drakes",
    mobile: "07470711410",
    email: "savannaantonia@gmail.com",
    createdAt: new Date(2024, 2, 31),
    updatedAt: new Date(2024, 2, 31),
    lastVisit: new Date(2025, 5, 31),
    consultationFormId: "cf91",
    notes: "",
    active: true,
  },
  {
    id: "c92",
    name: "Selda Ahmet",
    mobile: "07960298372",
    email: "seldaahmet@live.co.uk",
    createdAt: new Date(2024, 3, 1),
    updatedAt: new Date(2024, 3, 1),
    lastVisit: new Date(2025, 6, 1),
    consultationFormId: "cf92",
    notes: "",
    active: true,
  },
  {
    id: "c93",
    name: "Sharmila Patel",
    mobile: "07710976235",
    email: "sharmilap68@me.com",
    createdAt: new Date(2024, 3, 2),
    updatedAt: new Date(2024, 3, 2),
    lastVisit: new Date(2025, 6, 2),
    consultationFormId: "cf93",
    notes: "",
    active: true,
  },
  {
    id: "c94",
    name: "Sheila Morcombe",
    mobile: "07852300210",
    email: "sheilamorcombe@gmail.com",
    createdAt: new Date(2024, 3, 3),
    updatedAt: new Date(2024, 3, 3),
    lastVisit: new Date(2025, 6, 3),
    consultationFormId: "cf94",
    notes: "",
    active: true,
  },
  {
    id: "c95",
    name: "Simon Gregory",
    mobile: "07956366229",
    email: "simon_gregory14@hotmail.com",
    createdAt: new Date(2024, 3, 4),
    updatedAt: new Date(2024, 3, 4),
    lastVisit: new Date(2025, 6, 4),
    consultationFormId: "cf95",
    notes: "",
    active: true,
  },
  {
    id: "c96",
    name: "Stacey Gilmour",
    mobile: "07738582759",
    email: "gilmour931@btinternet.com",
    createdAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    lastVisit: new Date(2025, 6, 5),
    consultationFormId: "cf96",
    notes: "",
    active: true,
  },
  {
    id: "c97",
    name: "Stav Athanasiou",
    mobile: "07900226689",
    email: "stava60@btinternet.com",
    createdAt: new Date(2024, 3, 6),
    updatedAt: new Date(2024, 3, 6),
    lastVisit: new Date(2025, 6, 6),
    consultationFormId: "cf97",
    notes: "",
    active: true,
  },
  {
    id: "c98",
    name: "Sue Balcombe",
    mobile: "07710885744",
    email: "sue.balcombe@hotmail.co.uk",
    createdAt: new Date(2024, 3, 7),
    updatedAt: new Date(2024, 3, 7),
    lastVisit: new Date(2025, 6, 7),
    consultationFormId: "cf98",
    notes: "",
    active: true,
  },
  {
    id: "c99",
    name: "Susan Bentley",
    mobile: "07955250397",
    email: "emmajanebentley1@yahoo.co.uk",
    createdAt: new Date(2024, 3, 8),
    updatedAt: new Date(2024, 3, 8),
    lastVisit: new Date(2025, 6, 8),
    consultationFormId: "cf99",
    notes: "",
    active: true,
  },
  {
    id: "c100",
    name: "Terri O’Shaughnessy",
    mobile: "07920471112",
    email: "toshaughnessy@deloitte.co.uk",
    createdAt: new Date(2024, 3, 9),
    updatedAt: new Date(2024, 3, 9),
    lastVisit: new Date(2025, 6, 9),
    consultationFormId: "cf100",
    notes: "",
    active: true,
  },
  {
    id: "c101",
    name: "Tilly Gakhar",
    mobile: "07858927190",
    email: "tillygreiner@tahoo.co.uk",
    createdAt: new Date(2024, 3, 10),
    updatedAt: new Date(2024, 3, 10),
    lastVisit: new Date(2025, 6, 10),
    consultationFormId: "cf101",
    notes: "",
    active: true,
  },
  {
    id: "c102",
    name: "Tracy McLaughlin",
    mobile: "07730595982",
    email: "tracy@nlasolutions.com",
    createdAt: new Date(2024, 3, 11),
    updatedAt: new Date(2024, 3, 11),
    lastVisit: new Date(2025, 6, 11),
    consultationFormId: "cf102",
    notes: "",
    active: true,
  },
  {
    id: "c103",
    name: "Urszula Perry",
    mobile: "07917845598",
    email: "urszula.perry@gmail.com",
    createdAt: new Date(2024, 3, 12),
    updatedAt: new Date(2024, 3, 12),
    lastVisit: new Date(2025, 6, 12),
    consultationFormId: "cf103",
    notes: "",
    active: true,
  },
  {
    id: "c104",
    name: "Vickie McGrath",
    mobile: "07947370289",
    email: "vmcgrath1904@yahoo.com",
    createdAt: new Date(2024, 3, 13),
    updatedAt: new Date(2024, 3, 13),
    lastVisit: new Date(2025, 6, 13),
    consultationFormId: "cf104",
    notes: "",
    active: true,
  },
  {
    id: "c105",
    name: "Victoria Newell",
    mobile: "07734723628",
    email: "victorianewell@hotmail.co.uk",
    createdAt: new Date(2024, 3, 14),
    updatedAt: new Date(2024, 3, 14),
    lastVisit: new Date(2025, 6, 14),
    consultationFormId: "cf105",
    notes: "",
    active: true,
  },
  {
    id: "c106",
    name: "Violet Tredgett",
    mobile: "07854752033",
    email: "violet.tredgett@btinternet.com",
    createdAt: new Date(2024, 3, 15),
    updatedAt: new Date(2024, 3, 15),
    lastVisit: new Date(2025, 6, 15),
    consultationFormId: "cf106",
    notes: "",
    active: true,
  },
  {
    id: "c107",
    name: "Yemisi Solanke",
    mobile: "07960826052",
    email: "yemisisolanke@yahoo.co.uk",
    createdAt: new Date(2024, 3, 16),
    updatedAt: new Date(2024, 3, 16),
    lastVisit: new Date(2025, 6, 16),
    consultationFormId: "cf107",
    notes: "",
    active: true,
  },
  {
    id: "c108",
    name: "Zoe Packman",
    mobile: "07714151989",
    email: "zoe.packman@me.com",
    createdAt: new Date(2024, 3, 17),
    updatedAt: new Date(2024, 3, 17),
    lastVisit: new Date(2025, 6, 17),
    consultationFormId: "cf108",
    notes: "",
    active: true,
  },
  {
    id: "c109",
    name: "Zoe Minkin",
    mobile: "07920771686",
    email: "z.minkin@sky.com",
    createdAt: new Date(2024, 3, 18),
    updatedAt: new Date(2024, 3, 18),
    lastVisit: new Date(2025, 6, 18),
    consultationFormId: "cf109",
    notes: "",
    active: true,
  },
];

// Sample consultation forms
const INITIAL_CONSULTATION_FORMS: ConsultationForm[] = [
  {
    id: "cf1",
    customerId: "c1",
    completedAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 2, 15),
    skinType: "combination",
    allergies: ["Nuts"],
    medicalConditions: ["None"],
    medications: ["None"],
    skinConcerns: ["Fine lines", "Dryness"],
    previousTreatments: ["Facials"],
    lifestyle: {
      waterIntake: "2 liters daily",
      sleepHours: 7,
      stressLevel: "medium",
      exercise: "3 times per week",
      diet: "Balanced",
    },
    preferredProducts: ["Moisturizer", "Serum"],
    consentGiven: true,
    additionalNotes: "Interested in anti-aging treatments",
  },
  {
    id: "cf2",
    customerId: "c2",
    completedAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
    skinType: "sensitive",
    allergies: ["Lavender", "Certain fragrances"],
    medicalConditions: ["Eczema"],
    medications: ["Antihistamines occasionally"],
    skinConcerns: ["Redness", "Sensitivity"],
    previousTreatments: ["Gentle facials"],
    lifestyle: {
      waterIntake: "1.5 liters daily",
      sleepHours: 8,
      stressLevel: "low",
      exercise: "Yoga twice weekly",
      diet: "Vegetarian",
    },
    preferredProducts: ["Fragrance-free products"],
    consentGiven: true,
  },
  {
    id: "cf3",
    customerId: "c3",
    completedAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    skinType: "oily",
    allergies: [],
    medicalConditions: ["None"],
    medications: ["None"],
    skinConcerns: ["Acne", "Oiliness"],
    previousTreatments: ["Chemical peels"],
    lifestyle: {
      waterIntake: "3 liters daily",
      sleepHours: 6,
      stressLevel: "high",
      exercise: "Running 4 times weekly",
      diet: "High protein",
    },
    preferredProducts: ["Oil-free moisturizer", "Clay masks"],
    consentGiven: true,
  },
  {
    id: "cf4",
    customerId: "c5",
    completedAt: new Date(2024, 3, 15),
    updatedAt: new Date(2024, 3, 15),
    skinType: "sensitive",
    allergies: ["Certain preservatives"],
    medicalConditions: ["Rosacea"],
    medications: ["Topical prescription"],
    skinConcerns: ["Redness", "Sensitivity", "Dryness"],
    previousTreatments: ["LED light therapy"],
    lifestyle: {
      waterIntake: "2 liters daily",
      sleepHours: 7,
      stressLevel: "medium",
      exercise: "Walking daily",
      diet: "Avoiding spicy foods",
    },
    preferredProducts: ["Gentle cleanser", "Calming serum"],
    consentGiven: true,
    additionalNotes: "Avoids hot rooms and saunas",
  },
];

interface CustomerContextType {
  customers: Customer[];
  consultationForms: ConsultationForm[];
  addCustomer: (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getConsultationFormByCustomerId: (
    customerId: string
  ) => ConsultationForm | undefined;
  addConsultationForm: (
    form: Omit<ConsultationForm, "id" | "updatedAt">
  ) => string;
  updateConsultationForm: (
    id: string,
    formData: Partial<ConsultationForm>
  ) => void;
  generateConsultationFormLink: (customerId: string) => string;
  updateCustomerConsultationForm: (
    customerId: string,
    formData: Partial<ConsultationForm>
  ) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [consultationForms, setConsultationForms] = useState<
    ConsultationForm[]
  >([]);

  useEffect(() => {
    const storedCustomers = localStorage.getItem("gem-n-eyes-customers");
    const storedForms = localStorage.getItem("gem-n-eyes-consultation-forms");

    if (storedCustomers) {
      // Parse dates from JSON
      const parsedCustomers = JSON.parse(storedCustomers, (key, value) => {
        if (key === "createdAt" || key === "updatedAt" || key === "lastVisit") {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      setCustomers(parsedCustomers);
    } else {
      setCustomers(INITIAL_CUSTOMERS);
      localStorage.setItem(
        "gem-n-eyes-customers",
        JSON.stringify(INITIAL_CUSTOMERS)
      );
    }

    if (storedForms) {
      // Parse dates from JSON
      const parsedForms = JSON.parse(storedForms, (key, value) => {
        if (key === "completedAt" || key === "updatedAt") {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      setConsultationForms(parsedForms);
    } else {
      setConsultationForms(INITIAL_CONSULTATION_FORMS);
      localStorage.setItem(
        "gem-n-eyes-consultation-forms",
        JSON.stringify(INITIAL_CONSULTATION_FORMS)
      );
    }
  }, []);

  const addCustomer = (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date();
    const newCustomer: Customer = {
      ...customerData,
      id: `c${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem(
      "gem-n-eyes-customers",
      JSON.stringify(updatedCustomers)
    );
    return newCustomer.id;
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === id
        ? {
            ...customer,
            ...customerData,
            updatedAt: new Date(),
          }
        : customer
    );
    setCustomers(updatedCustomers);
    localStorage.setItem(
      "gem-n-eyes-customers",
      JSON.stringify(updatedCustomers)
    );
  };

  const deleteCustomer = (id: string) => {
    // In a real app, you might want to soft delete instead
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
    localStorage.setItem(
      "gem-n-eyes-customers",
      JSON.stringify(updatedCustomers)
    );

    // Also delete associated consultation form
    const updatedForms = consultationForms.filter(
      (form) => form.customerId !== id
    );
    setConsultationForms(updatedForms);
    localStorage.setItem(
      "gem-n-eyes-consultation-forms",
      JSON.stringify(updatedForms)
    );
  };

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  const getConsultationFormByCustomerId = (customerId: string) => {
    return consultationForms.find((form) => form.customerId === customerId);
  };

  const addConsultationForm = (
    formData: Omit<ConsultationForm, "id" | "updatedAt">
  ) => {
    const now = new Date();
    const newForm: ConsultationForm = {
      ...formData,
      id: `cf${uuidv4()}`,
      updatedAt: now,
    };

    const updatedForms = [...consultationForms, newForm];
    setConsultationForms(updatedForms);
    localStorage.setItem(
      "gem-n-eyes-consultation-forms",
      JSON.stringify(updatedForms)
    );

    // Update customer with consultation form ID
    const customer = customers.find((c) => c.id === formData.customerId);
    if (customer) {
      updateCustomer(customer.id, { consultationFormId: newForm.id });
    }

    return newForm.id;
  };

  const updateConsultationForm = (
    id: string,
    formData: Partial<ConsultationForm>
  ) => {
    const updatedForms = consultationForms.map((form) =>
      form.id === id
        ? {
            ...form,
            ...formData,
            updatedAt: new Date(),
          }
        : form
    );
    setConsultationForms(updatedForms);
    localStorage.setItem(
      "gem-n-eyes-consultation-forms",
      JSON.stringify(updatedForms)
    );
  };

  const generateConsultationFormLink = (customerId: string) => {
    // In a real app, this would generate a secure token
    // For this demo, we'll just use the customer ID
    return `/consultation-form/${customerId}`;
  };

  const updateCustomerConsultationForm = (
    customerId: string,
    formData: Partial<ConsultationForm>
  ) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const formId = customer.consultationFormId;
    if (!formId) return;

    updateConsultationForm(formId, formData);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        consultationForms,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        getConsultationFormByCustomerId,
        addConsultationForm,
        updateConsultationForm,
        generateConsultationFormLink,
        updateCustomerConsultationForm,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
