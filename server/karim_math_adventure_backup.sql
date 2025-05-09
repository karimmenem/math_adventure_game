--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.12

-- Started on 2025-05-09 11:28:02 EEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16395)
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    achievement_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    points_required integer NOT NULL,
    badge_icon text NOT NULL
);


ALTER TABLE public.achievements OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: achievements_achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.achievements_achievement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievements_achievement_id_seq OWNER TO postgres;

--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 215
-- Name: achievements_achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.achievements_achievement_id_seq OWNED BY public.achievements.achievement_id;


--
-- TOC entry 216 (class 1259 OID 16401)
-- Name: game_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_sessions (
    session_id integer NOT NULL,
    user_id integer,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp with time zone,
    problems_attempted integer DEFAULT 0,
    problems_correct integer DEFAULT 0,
    points_earned integer DEFAULT 0,
    game_mode character varying(20) DEFAULT 'normal'::character varying
);


ALTER TABLE public.game_sessions OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16409)
-- Name: game_sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.game_sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_sessions_session_id_seq OWNER TO postgres;

--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.game_sessions_session_id_seq OWNED BY public.game_sessions.session_id;


--
-- TOC entry 218 (class 1259 OID 16410)
-- Name: levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.levels (
    level_id integer NOT NULL,
    level_name character varying(100) NOT NULL,
    description text NOT NULL,
    required_points integer NOT NULL,
    category character varying(50) NOT NULL,
    max_difficulty integer NOT NULL
);


ALTER TABLE public.levels OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16415)
-- Name: levels_level_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.levels_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.levels_level_id_seq OWNER TO postgres;

--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 219
-- Name: levels_level_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.levels_level_id_seq OWNED BY public.levels.level_id;


--
-- TOC entry 220 (class 1259 OID 16416)
-- Name: problems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.problems (
    problem_id integer NOT NULL,
    category character varying(50) NOT NULL,
    difficulty_level integer NOT NULL,
    question text NOT NULL,
    correct_answer text NOT NULL,
    options text[],
    points integer DEFAULT 10 NOT NULL,
    problem_type character varying(50) DEFAULT 'standard'::character varying
);


ALTER TABLE public.problems OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16423)
-- Name: problems_problem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.problems_problem_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.problems_problem_id_seq OWNER TO postgres;

--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 221
-- Name: problems_problem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.problems_problem_id_seq OWNED BY public.problems.problem_id;


--
-- TOC entry 222 (class 1259 OID 16424)
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_achievements (
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    earned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_achievements OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    profile_id integer NOT NULL,
    user_id integer,
    avatar character varying(50) DEFAULT 'default'::character varying,
    username_color character varying(20) DEFAULT '#FFFFFF'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16435)
-- Name: user_profiles_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_profiles_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_profiles_profile_id_seq OWNER TO postgres;

--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_profiles_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_profiles_profile_id_seq OWNED BY public.user_profiles.profile_id;


--
-- TOC entry 225 (class 1259 OID 16436)
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    progress_id integer NOT NULL,
    user_id integer,
    current_level integer DEFAULT 1,
    total_points integer DEFAULT 0,
    problems_solved integer DEFAULT 0,
    last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16443)
-- Name: user_progress_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_progress_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_progress_progress_id_seq OWNER TO postgres;

--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 226
-- Name: user_progress_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_progress_progress_id_seq OWNED BY public.user_progress.progress_id;


--
-- TOC entry 227 (class 1259 OID 16444)
-- Name: user_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_records (
    record_id integer NOT NULL,
    user_id integer,
    record_type character varying(50) NOT NULL,
    record_value numeric NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_records OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16451)
-- Name: user_records_record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_records_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_records_record_id_seq OWNER TO postgres;

--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 228
-- Name: user_records_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_records_record_id_seq OWNED BY public.user_records.record_id;


--
-- TOC entry 229 (class 1259 OID 16452)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16456)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3478 (class 2604 OID 16457)
-- Name: achievements achievement_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements ALTER COLUMN achievement_id SET DEFAULT nextval('public.achievements_achievement_id_seq'::regclass);


--
-- TOC entry 3479 (class 2604 OID 16458)
-- Name: game_sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_sessions ALTER COLUMN session_id SET DEFAULT nextval('public.game_sessions_session_id_seq'::regclass);


--
-- TOC entry 3485 (class 2604 OID 16459)
-- Name: levels level_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels ALTER COLUMN level_id SET DEFAULT nextval('public.levels_level_id_seq'::regclass);


--
-- TOC entry 3486 (class 2604 OID 16460)
-- Name: problems problem_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.problems ALTER COLUMN problem_id SET DEFAULT nextval('public.problems_problem_id_seq'::regclass);


--
-- TOC entry 3490 (class 2604 OID 16461)
-- Name: user_profiles profile_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN profile_id SET DEFAULT nextval('public.user_profiles_profile_id_seq'::regclass);


--
-- TOC entry 3495 (class 2604 OID 16462)
-- Name: user_progress progress_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress ALTER COLUMN progress_id SET DEFAULT nextval('public.user_progress_progress_id_seq'::regclass);


--
-- TOC entry 3500 (class 2604 OID 16463)
-- Name: user_records record_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records ALTER COLUMN record_id SET DEFAULT nextval('public.user_records_record_id_seq'::regclass);


--
-- TOC entry 3503 (class 2604 OID 16464)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3678 (class 0 OID 16395)
-- Dependencies: 214
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (achievement_id, name, description, points_required, badge_icon) FROM stdin;
4	Math Novice	Solve your first 5 math problems	10	novice_badge.png
5	Math Explorer	Accumulate 200 total points	50	explorer_badge.png
6	Math Wizard	Solve 50 math problems	100	wizard_badge.png
7	Math Master	Solve 100 math problems	250	master_badge.png
8	Math Genius	Accumulate 500 total points	500	genius_badge.png
9	Perfect Streak	Complete a game with 100% correct answers	75	perfect_streak_badge.png
10	Speed Demon	Complete a game in under 1 minute with at least 5 correct problems	90	speed_demon_badge.png
11	Precision Pro	Complete 5 games with 90% or higher accuracy	150	precision_badge.png
12	Lightning Learner	Complete 10 timed challenges successfully	200	lightning_badge.png
13	Blitz Champion	Score 20 points in Blitz Mode	100	blitz_champion_badge.png
14	All-Types Conqueror	Complete an All Types mode game	125	all_types_badge.png
15	Practice Perfectionist	Complete 5 practice sessions in different categories	175	practice_badge.png
16	Beginner Breaker	Complete all Beginner level problems	50	beginner_badge.png
17	Intermediate Innovator	Complete all Intermediate level problems	150	intermediate_badge.png
18	Advanced Achiever	Complete all Advanced level problems	300	advanced_badge.png
19	Addition Ace	Master all Addition problems	100	addition_badge.png
20	Subtraction Strategist	Master all Subtraction problems	100	subtraction_badge.png
21	Multiplication Maestro	Master all Multiplication problems	100	multiplication_badge.png
22	Division Dynamo	Master all Division problems	100	division_badge.png
23	Fraction Fantastic	Master all Fraction problems	150	fraction_badge.png
24	Consistent Learner	Play 10 consecutive days	200	consistency_badge.png
25	Problem Solving Pro	Solve 500 total problems	400	pro_badge.png
26	Point Collector	Accumulate 1000 total points	500	collector_badge.png
27	Jack of All Trades	Complete problems in all categories	250	jack_of_all_trades_badge.png
28	Versatile Virtuoso	Complete problems at all difficulty levels	300	versatile_badge.png
\.


--
-- TOC entry 3680 (class 0 OID 16401)
-- Dependencies: 216
-- Data for Name: game_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_sessions (session_id, user_id, started_at, ended_at, problems_attempted, problems_correct, points_earned, game_mode) FROM stdin;
1264	2	2025-04-21 11:58:25.876077+03	\N	0	0	0	normal
1265	2	2025-04-21 11:58:25.945599+03	\N	0	0	0	normal
1266	2	2025-04-21 11:58:26.090406+03	\N	0	0	0	normal
1267	2	2025-04-21 11:58:26.111437+03	\N	0	0	0	normal
1268	2	2025-04-21 11:58:26.130927+03	\N	0	0	0	normal
1	1	2025-04-20 19:11:32.556957+03	2025-04-20 19:11:56.506305+03	5	5	50	normal
2	1	2025-04-20 19:13:39.969713+03	\N	0	0	0	normal
3	1	2025-04-20 19:13:45.289737+03	\N	0	0	0	normal
4	1	2025-04-20 19:13:45.316743+03	\N	0	0	0	normal
5	1	2025-04-20 19:13:45.332284+03	\N	0	0	0	normal
6	1	2025-04-20 19:13:45.346843+03	\N	0	0	0	normal
7	1	2025-04-20 19:13:45.366123+03	\N	0	0	0	normal
8	1	2025-04-20 19:13:45.491252+03	\N	0	0	0	normal
9	1	2025-04-20 19:13:45.569554+03	\N	0	0	0	normal
10	1	2025-04-20 19:13:45.588652+03	\N	0	0	0	normal
11	1	2025-04-20 19:13:45.608442+03	\N	0	0	0	normal
12	1	2025-04-20 19:13:45.624594+03	\N	0	0	0	normal
13	1	2025-04-20 19:13:45.649428+03	\N	0	0	0	normal
14	1	2025-04-20 19:13:45.668241+03	\N	0	0	0	normal
15	1	2025-04-20 19:13:45.687063+03	\N	0	0	0	normal
16	1	2025-04-20 19:13:45.700539+03	\N	0	0	0	normal
17	1	2025-04-20 19:13:45.721501+03	\N	0	0	0	normal
18	1	2025-04-20 19:13:45.739375+03	\N	0	0	0	normal
19	1	2025-04-20 19:13:45.84095+03	\N	0	0	0	normal
20	1	2025-04-20 19:13:45.857064+03	\N	0	0	0	normal
21	1	2025-04-20 19:13:45.871967+03	\N	0	0	0	normal
22	1	2025-04-20 19:13:45.883442+03	\N	0	0	0	normal
23	1	2025-04-20 19:13:45.899414+03	\N	0	0	0	normal
24	1	2025-04-20 19:13:45.91134+03	\N	0	0	0	normal
25	1	2025-04-20 19:13:45.929532+03	\N	0	0	0	normal
26	1	2025-04-20 19:13:45.98796+03	\N	0	0	0	normal
27	1	2025-04-20 19:13:46.006269+03	\N	0	0	0	normal
28	1	2025-04-20 19:13:46.025132+03	\N	0	0	0	normal
29	1	2025-04-20 19:13:46.041361+03	\N	0	0	0	normal
30	1	2025-04-20 19:13:46.057448+03	\N	0	0	0	normal
31	1	2025-04-20 19:13:46.074456+03	\N	0	0	0	normal
32	1	2025-04-20 19:13:46.089807+03	\N	0	0	0	normal
33	1	2025-04-20 19:13:46.106712+03	\N	0	0	0	normal
34	1	2025-04-20 19:13:46.124563+03	\N	0	0	0	normal
35	1	2025-04-20 19:13:46.164543+03	\N	0	0	0	normal
36	1	2025-04-20 19:13:46.18035+03	\N	0	0	0	normal
37	1	2025-04-20 19:13:46.196493+03	\N	0	0	0	normal
38	1	2025-04-20 19:13:46.212084+03	\N	0	0	0	normal
39	1	2025-04-20 19:13:46.226325+03	\N	0	0	0	normal
40	1	2025-04-20 19:13:46.2408+03	\N	0	0	0	normal
41	1	2025-04-20 19:13:46.260775+03	\N	0	0	0	normal
42	1	2025-04-20 19:13:46.277149+03	\N	0	0	0	normal
43	1	2025-04-20 19:13:46.294119+03	\N	0	0	0	normal
44	1	2025-04-20 19:13:46.314257+03	\N	0	0	0	normal
45	1	2025-04-20 19:13:46.339224+03	\N	0	0	0	normal
46	1	2025-04-20 19:13:46.35515+03	\N	0	0	0	normal
47	1	2025-04-20 19:13:46.36739+03	\N	0	0	0	normal
48	1	2025-04-20 19:13:46.381495+03	\N	0	0	0	normal
49	1	2025-04-20 19:13:46.39683+03	\N	0	0	0	normal
50	1	2025-04-20 19:13:46.411214+03	\N	0	0	0	normal
51	1	2025-04-20 19:13:46.425006+03	\N	0	0	0	normal
52	1	2025-04-20 19:13:46.440081+03	\N	0	0	0	normal
53	1	2025-04-20 19:13:46.456122+03	\N	0	0	0	normal
54	1	2025-04-20 19:13:46.472147+03	\N	0	0	0	normal
55	1	2025-04-20 19:13:46.48809+03	\N	0	0	0	normal
56	1	2025-04-20 19:13:46.500306+03	\N	0	0	0	normal
57	1	2025-04-20 19:13:46.516173+03	\N	0	0	0	normal
58	1	2025-04-20 19:13:46.531386+03	\N	0	0	0	normal
59	1	2025-04-20 19:13:46.547959+03	\N	0	0	0	normal
60	1	2025-04-20 19:13:46.564852+03	\N	0	0	0	normal
61	1	2025-04-20 19:13:46.582948+03	\N	0	0	0	normal
62	1	2025-04-20 19:13:46.597791+03	\N	0	0	0	normal
63	1	2025-04-20 19:13:46.613713+03	\N	0	0	0	normal
64	1	2025-04-20 19:13:46.629177+03	\N	0	0	0	normal
65	1	2025-04-20 19:13:46.660773+03	\N	0	0	0	normal
66	1	2025-04-20 19:13:46.673699+03	\N	0	0	0	normal
67	1	2025-04-20 19:13:46.723289+03	\N	0	0	0	normal
68	1	2025-04-20 19:13:46.739559+03	\N	0	0	0	normal
69	1	2025-04-20 19:13:46.755651+03	\N	0	0	0	normal
70	1	2025-04-20 19:13:46.769262+03	\N	0	0	0	normal
71	1	2025-04-20 19:13:46.781729+03	\N	0	0	0	normal
72	1	2025-04-20 19:13:46.797348+03	\N	0	0	0	normal
73	1	2025-04-20 19:13:46.811143+03	\N	0	0	0	normal
74	1	2025-04-20 19:13:46.826855+03	\N	0	0	0	normal
75	1	2025-04-20 19:13:46.840504+03	\N	0	0	0	normal
76	1	2025-04-20 19:13:46.853589+03	\N	0	0	0	normal
77	1	2025-04-20 19:13:46.866171+03	\N	0	0	0	normal
78	1	2025-04-20 19:13:46.883315+03	\N	0	0	0	normal
79	1	2025-04-20 19:13:46.899416+03	\N	0	0	0	normal
80	1	2025-04-20 19:13:46.915504+03	\N	0	0	0	normal
81	1	2025-04-20 19:13:46.955213+03	\N	0	0	0	normal
82	1	2025-04-20 19:13:46.972069+03	\N	0	0	0	normal
83	1	2025-04-20 19:13:46.98689+03	\N	0	0	0	normal
84	1	2025-04-20 19:13:47.000592+03	\N	0	0	0	normal
85	1	2025-04-20 19:13:47.015641+03	\N	0	0	0	normal
86	1	2025-04-20 19:13:47.031917+03	\N	0	0	0	normal
87	1	2025-04-20 19:13:47.0495+03	\N	0	0	0	normal
88	1	2025-04-20 19:13:47.06526+03	\N	0	0	0	normal
89	1	2025-04-20 19:13:47.081657+03	\N	0	0	0	normal
90	1	2025-04-20 19:13:47.095881+03	\N	0	0	0	normal
91	1	2025-04-20 19:13:47.111601+03	\N	0	0	0	normal
92	1	2025-04-20 19:13:47.128626+03	\N	0	0	0	normal
93	1	2025-04-20 19:13:47.191581+03	\N	0	0	0	normal
94	1	2025-04-20 19:13:47.225043+03	\N	0	0	0	normal
95	1	2025-04-20 19:13:47.240906+03	\N	0	0	0	normal
96	1	2025-04-20 19:13:47.256623+03	\N	0	0	0	normal
97	1	2025-04-20 19:13:47.272486+03	\N	0	0	0	normal
98	1	2025-04-20 19:13:47.290041+03	\N	0	0	0	normal
99	1	2025-04-20 19:13:47.314683+03	\N	0	0	0	normal
100	1	2025-04-20 19:13:47.338132+03	\N	0	0	0	normal
101	1	2025-04-20 19:13:47.355368+03	\N	0	0	0	normal
102	1	2025-04-20 19:13:47.367356+03	\N	0	0	0	normal
103	1	2025-04-20 19:13:47.381837+03	\N	0	0	0	normal
104	1	2025-04-20 19:13:47.398665+03	\N	0	0	0	normal
105	1	2025-04-20 19:13:47.413744+03	\N	0	0	0	normal
106	1	2025-04-20 19:13:47.426318+03	\N	0	0	0	normal
107	1	2025-04-20 19:13:47.440216+03	\N	0	0	0	normal
108	1	2025-04-20 19:13:47.456984+03	\N	0	0	0	normal
109	1	2025-04-20 19:13:47.468399+03	\N	0	0	0	normal
110	1	2025-04-20 19:13:47.481429+03	\N	0	0	0	normal
111	1	2025-04-20 19:13:47.496695+03	\N	0	0	0	normal
112	1	2025-04-20 19:13:47.518858+03	\N	0	0	0	normal
113	1	2025-04-20 19:13:47.531485+03	\N	0	0	0	normal
114	1	2025-04-20 19:13:47.546708+03	\N	0	0	0	normal
115	1	2025-04-20 19:13:47.560881+03	\N	0	0	0	normal
116	1	2025-04-20 19:13:47.574417+03	\N	0	0	0	normal
117	1	2025-04-20 19:13:47.61173+03	\N	0	0	0	normal
118	1	2025-04-20 19:13:47.638738+03	\N	0	0	0	normal
119	1	2025-04-20 19:13:47.654057+03	\N	0	0	0	normal
120	1	2025-04-20 19:13:47.66923+03	\N	0	0	0	normal
121	1	2025-04-20 19:13:47.689334+03	\N	0	0	0	normal
122	1	2025-04-20 19:13:47.705146+03	\N	0	0	0	normal
123	1	2025-04-20 19:13:47.720976+03	\N	0	0	0	normal
124	1	2025-04-20 19:13:47.740582+03	\N	0	0	0	normal
125	1	2025-04-20 19:13:47.757278+03	\N	0	0	0	normal
126	1	2025-04-20 19:13:47.772548+03	\N	0	0	0	normal
127	1	2025-04-20 19:13:47.784822+03	\N	0	0	0	normal
128	1	2025-04-20 19:13:47.800253+03	\N	0	0	0	normal
129	1	2025-04-20 19:13:47.816994+03	\N	0	0	0	normal
130	1	2025-04-20 19:13:47.84078+03	\N	0	0	0	normal
131	1	2025-04-20 19:13:47.855946+03	\N	0	0	0	normal
132	1	2025-04-20 19:13:47.871403+03	\N	0	0	0	normal
133	1	2025-04-20 19:13:47.885298+03	\N	0	0	0	normal
134	1	2025-04-20 19:13:47.905987+03	\N	0	0	0	normal
135	1	2025-04-20 19:13:47.922892+03	\N	0	0	0	normal
136	1	2025-04-20 19:13:47.948023+03	\N	0	0	0	normal
137	1	2025-04-20 19:13:47.986096+03	\N	0	0	0	normal
138	1	2025-04-20 19:13:47.997483+03	\N	0	0	0	normal
139	1	2025-04-20 19:13:48.013279+03	\N	0	0	0	normal
140	1	2025-04-20 19:13:48.031111+03	\N	0	0	0	normal
141	1	2025-04-20 19:13:48.047411+03	\N	0	0	0	normal
142	1	2025-04-20 19:13:48.065299+03	\N	0	0	0	normal
143	1	2025-04-20 19:13:48.086418+03	\N	0	0	0	normal
144	1	2025-04-20 19:13:48.104284+03	\N	0	0	0	normal
145	1	2025-04-20 19:13:48.122859+03	\N	0	0	0	normal
146	1	2025-04-20 19:13:48.15742+03	\N	0	0	0	normal
147	1	2025-04-20 19:13:48.175039+03	\N	0	0	0	normal
148	1	2025-04-20 19:13:48.190891+03	\N	0	0	0	normal
149	1	2025-04-20 19:13:48.213293+03	\N	0	0	0	normal
150	1	2025-04-20 19:13:48.230093+03	\N	0	0	0	normal
151	1	2025-04-20 19:13:48.251053+03	\N	0	0	0	normal
152	1	2025-04-20 19:13:48.27056+03	\N	0	0	0	normal
153	1	2025-04-20 19:13:48.285716+03	\N	0	0	0	normal
154	1	2025-04-20 19:13:48.306222+03	\N	0	0	0	normal
155	1	2025-04-20 19:13:48.322807+03	\N	0	0	0	normal
156	1	2025-04-20 19:13:48.338722+03	\N	0	0	0	normal
157	1	2025-04-20 19:13:48.353499+03	\N	0	0	0	normal
158	1	2025-04-20 19:13:48.367459+03	\N	0	0	0	normal
159	1	2025-04-20 19:13:48.383936+03	\N	0	0	0	normal
160	1	2025-04-20 19:13:48.404988+03	\N	0	0	0	normal
161	1	2025-04-20 19:13:48.42126+03	\N	0	0	0	normal
162	1	2025-04-20 19:13:48.434101+03	\N	0	0	0	normal
163	1	2025-04-20 19:13:48.450352+03	\N	0	0	0	normal
164	1	2025-04-20 19:13:48.470653+03	\N	0	0	0	normal
165	1	2025-04-20 19:13:48.483346+03	\N	0	0	0	normal
166	1	2025-04-20 19:13:48.499796+03	\N	0	0	0	normal
167	1	2025-04-20 19:13:48.516414+03	\N	0	0	0	normal
168	1	2025-04-20 19:13:48.533172+03	\N	0	0	0	normal
169	1	2025-04-20 19:13:48.548609+03	\N	0	0	0	normal
170	1	2025-04-20 19:13:48.566139+03	\N	0	0	0	normal
171	1	2025-04-20 19:13:48.584838+03	\N	0	0	0	normal
172	1	2025-04-20 19:13:48.598998+03	\N	0	0	0	normal
173	1	2025-04-20 19:13:48.617619+03	\N	0	0	0	normal
174	1	2025-04-20 19:13:48.632143+03	\N	0	0	0	normal
175	1	2025-04-20 19:13:48.648307+03	\N	0	0	0	normal
176	1	2025-04-20 19:13:48.680826+03	\N	0	0	0	normal
177	1	2025-04-20 19:13:48.698793+03	\N	0	0	0	normal
178	1	2025-04-20 19:13:48.71626+03	\N	0	0	0	normal
179	1	2025-04-20 19:13:48.732725+03	\N	0	0	0	normal
180	1	2025-04-20 19:13:48.74814+03	\N	0	0	0	normal
181	1	2025-04-20 19:13:48.777347+03	\N	0	0	0	normal
182	1	2025-04-20 19:13:55.129182+03	\N	0	0	0	normal
183	1	2025-04-20 19:13:55.167129+03	\N	0	0	0	normal
184	1	2025-04-20 19:13:55.206088+03	\N	0	0	0	normal
185	1	2025-04-20 19:13:55.224707+03	\N	0	0	0	normal
186	1	2025-04-20 19:13:55.238504+03	\N	0	0	0	normal
187	1	2025-04-20 19:13:55.248669+03	\N	0	0	0	normal
188	1	2025-04-20 19:13:55.265037+03	\N	0	0	0	normal
189	1	2025-04-20 19:13:55.281523+03	\N	0	0	0	normal
190	1	2025-04-20 19:13:55.319721+03	\N	0	0	0	normal
191	1	2025-04-20 19:13:55.337419+03	\N	0	0	0	normal
192	1	2025-04-20 19:13:55.34972+03	\N	0	0	0	normal
193	1	2025-04-20 19:13:55.365978+03	\N	0	0	0	normal
194	1	2025-04-20 19:13:55.384966+03	\N	0	0	0	normal
195	1	2025-04-20 19:13:55.39855+03	\N	0	0	0	normal
196	1	2025-04-20 19:13:55.414854+03	\N	0	0	0	normal
197	1	2025-04-20 19:13:55.432377+03	\N	0	0	0	normal
198	1	2025-04-20 19:13:55.448705+03	\N	0	0	0	normal
199	1	2025-04-20 19:13:55.481115+03	\N	0	0	0	normal
200	1	2025-04-20 19:13:55.493931+03	\N	0	0	0	normal
201	1	2025-04-20 19:13:55.509545+03	\N	0	0	0	normal
202	1	2025-04-20 19:13:55.526471+03	\N	0	0	0	normal
203	1	2025-04-20 19:13:55.541557+03	\N	0	0	0	normal
204	1	2025-04-20 19:13:55.557767+03	\N	0	0	0	normal
205	1	2025-04-20 19:13:55.573395+03	\N	0	0	0	normal
206	1	2025-04-20 19:13:55.590368+03	\N	0	0	0	normal
207	1	2025-04-20 19:13:55.608344+03	\N	0	0	0	normal
208	1	2025-04-20 19:13:55.625075+03	\N	0	0	0	normal
209	1	2025-04-20 19:13:55.641812+03	\N	0	0	0	normal
210	1	2025-04-20 19:13:55.657437+03	\N	0	0	0	normal
211	1	2025-04-20 19:13:55.672746+03	\N	0	0	0	normal
212	1	2025-04-20 19:13:55.682938+03	\N	0	0	0	normal
213	1	2025-04-20 19:13:55.696852+03	\N	0	0	0	normal
214	1	2025-04-20 19:13:55.710061+03	\N	0	0	0	normal
215	1	2025-04-20 19:13:55.723255+03	\N	0	0	0	normal
216	1	2025-04-20 19:13:55.738704+03	\N	0	0	0	normal
217	1	2025-04-20 19:13:55.750366+03	\N	0	0	0	normal
218	1	2025-04-20 19:13:55.763996+03	\N	0	0	0	normal
219	1	2025-04-20 19:13:55.77979+03	\N	0	0	0	normal
220	1	2025-04-20 19:13:55.792255+03	\N	0	0	0	normal
221	1	2025-04-20 19:13:55.806607+03	\N	0	0	0	normal
222	1	2025-04-20 19:13:55.822152+03	\N	0	0	0	normal
223	1	2025-04-20 19:13:55.834021+03	\N	0	0	0	normal
224	1	2025-04-20 19:13:55.999372+03	\N	0	0	0	normal
225	1	2025-04-20 19:13:56.022427+03	\N	0	0	0	normal
226	1	2025-04-20 19:13:56.037516+03	\N	0	0	0	normal
227	1	2025-04-20 19:13:56.05057+03	\N	0	0	0	normal
228	1	2025-04-20 19:13:56.064337+03	\N	0	0	0	normal
229	1	2025-04-20 19:13:56.079475+03	\N	0	0	0	normal
230	1	2025-04-20 19:13:56.094645+03	\N	0	0	0	normal
231	1	2025-04-20 19:13:56.114573+03	\N	0	0	0	normal
232	1	2025-04-20 19:13:56.138723+03	\N	0	0	0	normal
233	1	2025-04-20 19:13:56.15916+03	\N	0	0	0	normal
234	1	2025-04-20 19:13:56.175524+03	\N	0	0	0	normal
235	1	2025-04-20 19:13:56.190522+03	\N	0	0	0	normal
236	1	2025-04-20 19:13:56.207749+03	\N	0	0	0	normal
237	1	2025-04-20 19:13:56.225405+03	\N	0	0	0	normal
238	1	2025-04-20 19:13:56.242429+03	\N	0	0	0	normal
239	1	2025-04-20 19:13:56.258328+03	\N	0	0	0	normal
240	1	2025-04-20 19:13:56.273582+03	\N	0	0	0	normal
241	1	2025-04-20 19:13:56.29136+03	\N	0	0	0	normal
242	1	2025-04-20 19:13:56.306476+03	\N	0	0	0	normal
243	1	2025-04-20 19:13:56.323367+03	\N	0	0	0	normal
244	1	2025-04-20 19:13:56.340155+03	\N	0	0	0	normal
245	1	2025-04-20 19:13:56.356662+03	\N	0	0	0	normal
246	1	2025-04-20 19:13:56.372126+03	\N	0	0	0	normal
247	1	2025-04-20 19:13:56.388144+03	\N	0	0	0	normal
248	1	2025-04-20 19:13:56.401951+03	\N	0	0	0	normal
249	1	2025-04-20 19:13:56.420366+03	\N	0	0	0	normal
250	1	2025-04-20 19:13:56.436281+03	\N	0	0	0	normal
251	1	2025-04-20 19:13:56.450464+03	\N	0	0	0	normal
252	1	2025-04-20 19:13:56.467272+03	\N	0	0	0	normal
253	1	2025-04-20 19:13:56.482243+03	\N	0	0	0	normal
254	1	2025-04-20 19:13:56.499557+03	\N	0	0	0	normal
255	1	2025-04-20 19:13:56.515924+03	\N	0	0	0	normal
256	1	2025-04-20 19:13:56.532066+03	\N	0	0	0	normal
257	1	2025-04-20 19:13:56.550062+03	\N	0	0	0	normal
258	1	2025-04-20 19:13:56.564655+03	\N	0	0	0	normal
259	1	2025-04-20 19:13:56.580778+03	\N	0	0	0	normal
260	1	2025-04-20 19:13:56.602477+03	\N	0	0	0	normal
261	1	2025-04-20 19:13:56.618006+03	\N	0	0	0	normal
262	1	2025-04-20 19:13:56.631854+03	\N	0	0	0	normal
263	1	2025-04-20 19:13:56.647983+03	\N	0	0	0	normal
264	1	2025-04-20 19:13:56.660612+03	\N	0	0	0	normal
265	1	2025-04-20 19:14:00.505705+03	\N	0	0	0	normal
266	1	2025-04-20 19:14:00.532423+03	\N	0	0	0	normal
267	1	2025-04-20 19:14:00.555884+03	\N	0	0	0	normal
268	1	2025-04-20 19:14:00.570642+03	\N	0	0	0	normal
269	1	2025-04-20 19:14:00.582177+03	\N	0	0	0	normal
270	1	2025-04-20 19:14:00.597431+03	\N	0	0	0	normal
271	1	2025-04-20 19:14:00.608935+03	\N	0	0	0	normal
272	1	2025-04-20 19:14:00.62379+03	\N	0	0	0	normal
273	1	2025-04-20 19:14:00.640627+03	\N	0	0	0	normal
274	1	2025-04-20 19:14:00.657518+03	\N	0	0	0	normal
275	1	2025-04-20 19:14:00.673205+03	\N	0	0	0	normal
276	1	2025-04-20 19:14:00.691851+03	\N	0	0	0	normal
277	1	2025-04-20 19:14:00.725287+03	\N	0	0	0	normal
278	1	2025-04-20 19:14:00.740907+03	\N	0	0	0	normal
279	1	2025-04-20 19:14:00.755889+03	\N	0	0	0	normal
280	1	2025-04-20 19:14:00.768766+03	\N	0	0	0	normal
281	1	2025-04-20 19:14:00.782514+03	\N	0	0	0	normal
282	1	2025-04-20 19:14:00.79948+03	\N	0	0	0	normal
283	1	2025-04-20 19:14:00.816932+03	\N	0	0	0	normal
284	1	2025-04-20 19:14:00.832127+03	\N	0	0	0	normal
285	1	2025-04-20 19:14:00.848868+03	\N	0	0	0	normal
286	1	2025-04-20 19:14:00.86484+03	\N	0	0	0	normal
287	1	2025-04-20 19:14:00.882569+03	\N	0	0	0	normal
288	1	2025-04-20 19:14:00.899865+03	\N	0	0	0	normal
289	1	2025-04-20 19:14:00.917254+03	\N	0	0	0	normal
290	1	2025-04-20 19:14:00.945334+03	\N	0	0	0	normal
291	1	2025-04-20 19:14:00.960482+03	\N	0	0	0	normal
292	1	2025-04-20 19:14:00.976023+03	\N	0	0	0	normal
293	1	2025-04-20 19:14:00.990376+03	\N	0	0	0	normal
294	1	2025-04-20 19:14:01.006038+03	\N	0	0	0	normal
295	1	2025-04-20 19:14:01.020011+03	\N	0	0	0	normal
296	1	2025-04-20 19:14:01.032133+03	\N	0	0	0	normal
297	1	2025-04-20 19:14:01.046463+03	\N	0	0	0	normal
298	1	2025-04-20 19:14:01.058424+03	\N	0	0	0	normal
299	1	2025-04-20 19:14:01.07307+03	\N	0	0	0	normal
300	1	2025-04-20 19:14:01.085112+03	\N	0	0	0	normal
301	1	2025-04-20 19:14:01.098554+03	\N	0	0	0	normal
302	1	2025-04-20 19:14:01.119499+03	\N	0	0	0	normal
303	1	2025-04-20 19:14:01.141807+03	\N	0	0	0	normal
304	1	2025-04-20 19:14:01.174597+03	\N	0	0	0	normal
305	1	2025-04-20 19:14:01.193358+03	\N	0	0	0	normal
306	1	2025-04-20 19:14:01.206774+03	\N	0	0	0	normal
307	1	2025-04-20 19:14:01.226908+03	\N	0	0	0	normal
308	1	2025-04-20 19:14:01.242009+03	\N	0	0	0	normal
309	1	2025-04-20 19:14:01.259418+03	\N	0	0	0	normal
310	1	2025-04-20 19:14:01.276319+03	\N	0	0	0	normal
311	1	2025-04-20 19:14:01.293299+03	\N	0	0	0	normal
312	1	2025-04-20 19:14:01.327445+03	\N	0	0	0	normal
313	1	2025-04-20 19:14:01.345544+03	\N	0	0	0	normal
314	1	2025-04-20 19:14:01.360339+03	\N	0	0	0	normal
315	1	2025-04-20 19:14:01.381758+03	\N	0	0	0	normal
316	1	2025-04-20 19:14:01.398754+03	\N	0	0	0	normal
317	1	2025-04-20 19:14:01.414795+03	\N	0	0	0	normal
318	1	2025-04-20 19:14:01.432062+03	\N	0	0	0	normal
319	1	2025-04-20 19:14:01.449055+03	\N	0	0	0	normal
320	1	2025-04-20 19:14:01.48289+03	\N	0	0	0	normal
321	1	2025-04-20 19:14:01.498166+03	\N	0	0	0	normal
322	1	2025-04-20 19:14:01.51648+03	\N	0	0	0	normal
323	1	2025-04-20 19:14:01.532516+03	\N	0	0	0	normal
324	1	2025-04-20 19:14:01.548713+03	\N	0	0	0	normal
325	1	2025-04-20 19:14:01.564285+03	\N	0	0	0	normal
326	1	2025-04-20 19:14:01.579511+03	\N	0	0	0	normal
327	1	2025-04-20 19:14:01.597755+03	\N	0	0	0	normal
328	1	2025-04-20 19:14:01.627075+03	\N	0	0	0	normal
329	1	2025-04-20 19:14:01.64019+03	\N	0	0	0	normal
330	1	2025-04-20 19:14:01.657774+03	\N	0	0	0	normal
331	1	2025-04-20 19:14:01.675124+03	\N	0	0	0	normal
332	1	2025-04-20 19:14:01.689833+03	\N	0	0	0	normal
333	1	2025-04-20 19:14:01.705397+03	\N	0	0	0	normal
334	1	2025-04-20 19:14:01.721606+03	\N	0	0	0	normal
335	1	2025-04-20 19:14:01.739294+03	\N	0	0	0	normal
336	1	2025-04-20 19:14:01.756316+03	\N	0	0	0	normal
337	1	2025-04-20 19:14:01.772589+03	\N	0	0	0	normal
338	1	2025-04-20 19:14:01.788168+03	\N	0	0	0	normal
339	1	2025-04-20 19:14:01.800751+03	\N	0	0	0	normal
340	1	2025-04-20 19:14:01.816888+03	\N	0	0	0	normal
341	1	2025-04-20 19:14:01.83278+03	\N	0	0	0	normal
342	1	2025-04-20 19:14:01.848031+03	\N	0	0	0	normal
343	1	2025-04-20 19:14:01.862981+03	\N	0	0	0	normal
344	1	2025-04-20 19:14:01.875753+03	\N	0	0	0	normal
345	1	2025-04-20 19:14:05.704227+03	\N	0	0	0	normal
346	1	2025-04-20 19:15:01.45295+03	\N	0	0	0	normal
347	1	2025-04-20 19:15:01.492798+03	\N	0	0	0	normal
348	1	2025-04-20 19:15:01.511239+03	\N	0	0	0	normal
349	1	2025-04-20 19:15:01.527988+03	\N	0	0	0	normal
350	1	2025-04-20 19:15:01.553961+03	\N	0	0	0	normal
351	1	2025-04-20 19:15:01.567245+03	\N	0	0	0	normal
352	1	2025-04-20 19:15:01.581405+03	\N	0	0	0	normal
353	1	2025-04-20 19:15:01.600724+03	\N	0	0	0	normal
354	1	2025-04-20 19:15:01.6248+03	\N	0	0	0	normal
355	1	2025-04-20 19:15:01.638487+03	\N	0	0	0	normal
356	1	2025-04-20 19:15:01.649592+03	\N	0	0	0	normal
357	1	2025-04-20 19:15:01.673212+03	\N	0	0	0	normal
358	1	2025-04-20 19:15:01.684026+03	\N	0	0	0	normal
359	1	2025-04-20 19:15:01.699466+03	\N	0	0	0	normal
360	1	2025-04-20 19:15:01.711015+03	\N	0	0	0	normal
361	1	2025-04-20 19:15:01.727455+03	\N	0	0	0	normal
362	1	2025-04-20 19:15:01.747198+03	\N	0	0	0	normal
363	1	2025-04-20 19:15:01.762869+03	\N	0	0	0	normal
364	1	2025-04-20 19:15:01.777128+03	\N	0	0	0	normal
365	1	2025-04-20 19:15:01.794831+03	\N	0	0	0	normal
366	1	2025-04-20 19:15:01.811492+03	\N	0	0	0	normal
367	1	2025-04-20 19:15:01.827017+03	\N	0	0	0	normal
368	1	2025-04-20 19:15:01.843621+03	\N	0	0	0	normal
369	1	2025-04-20 19:15:01.860919+03	\N	0	0	0	normal
370	1	2025-04-20 19:15:01.876986+03	\N	0	0	0	normal
371	1	2025-04-20 19:15:01.894074+03	\N	0	0	0	normal
372	1	2025-04-20 19:15:01.911232+03	\N	0	0	0	normal
373	1	2025-04-20 19:15:01.928687+03	\N	0	0	0	normal
374	1	2025-04-20 19:15:01.966708+03	\N	0	0	0	normal
375	1	2025-04-20 19:15:01.993962+03	\N	0	0	0	normal
376	1	2025-04-20 19:15:02.014405+03	\N	0	0	0	normal
377	1	2025-04-20 19:15:02.027765+03	\N	0	0	0	normal
378	1	2025-04-20 19:15:02.047803+03	\N	0	0	0	normal
379	1	2025-04-20 19:15:02.064135+03	\N	0	0	0	normal
380	1	2025-04-20 19:15:02.079105+03	\N	0	0	0	normal
381	1	2025-04-20 19:15:02.093288+03	\N	0	0	0	normal
382	1	2025-04-20 19:15:02.110708+03	\N	0	0	0	normal
383	1	2025-04-20 19:15:02.127474+03	\N	0	0	0	normal
384	1	2025-04-20 19:15:02.151114+03	\N	0	0	0	normal
385	1	2025-04-20 19:15:02.16605+03	\N	0	0	0	normal
386	1	2025-04-20 19:15:02.181222+03	\N	0	0	0	normal
387	1	2025-04-20 19:15:02.193402+03	\N	0	0	0	normal
388	1	2025-04-20 19:15:02.210886+03	\N	0	0	0	normal
389	1	2025-04-20 19:15:02.224337+03	\N	0	0	0	normal
390	1	2025-04-20 19:15:02.238393+03	\N	0	0	0	normal
391	1	2025-04-20 19:15:02.253221+03	\N	0	0	0	normal
392	1	2025-04-20 19:15:02.267517+03	\N	0	0	0	normal
393	1	2025-04-20 19:15:02.282176+03	\N	0	0	0	normal
394	1	2025-04-20 19:15:02.300503+03	\N	0	0	0	normal
395	1	2025-04-20 19:15:02.31637+03	\N	0	0	0	normal
396	1	2025-04-20 19:15:02.333742+03	\N	0	0	0	normal
397	1	2025-04-20 19:15:02.360266+03	\N	0	0	0	normal
398	1	2025-04-20 19:15:02.377389+03	\N	0	0	0	normal
399	1	2025-04-20 19:15:02.392221+03	\N	0	0	0	normal
400	1	2025-04-20 19:15:02.408199+03	\N	0	0	0	normal
401	1	2025-04-20 19:15:02.423519+03	\N	0	0	0	normal
402	1	2025-04-20 19:15:02.443952+03	\N	0	0	0	normal
403	1	2025-04-20 19:15:02.523967+03	\N	0	0	0	normal
404	1	2025-04-20 19:15:02.574562+03	\N	0	0	0	normal
405	1	2025-04-20 19:15:02.596987+03	\N	0	0	0	normal
406	1	2025-04-20 19:15:02.614362+03	\N	0	0	0	normal
407	1	2025-04-20 19:15:02.634413+03	\N	0	0	0	normal
408	1	2025-04-20 19:15:02.650818+03	\N	0	0	0	normal
409	1	2025-04-20 19:15:02.677134+03	\N	0	0	0	normal
410	1	2025-04-20 19:15:02.698789+03	\N	0	0	0	normal
411	1	2025-04-20 19:15:02.717784+03	\N	0	0	0	normal
412	1	2025-04-20 19:15:02.734296+03	\N	0	0	0	normal
413	1	2025-04-20 19:15:02.748935+03	\N	0	0	0	normal
414	1	2025-04-20 19:15:02.769877+03	\N	0	0	0	normal
415	1	2025-04-20 19:15:02.788327+03	\N	0	0	0	normal
416	1	2025-04-20 19:15:02.804119+03	\N	0	0	0	normal
417	1	2025-04-20 19:15:02.819611+03	\N	0	0	0	normal
418	1	2025-04-20 19:15:02.836408+03	\N	0	0	0	normal
419	1	2025-04-20 19:15:02.850773+03	\N	0	0	0	normal
420	1	2025-04-20 19:15:02.868406+03	\N	0	0	0	normal
421	1	2025-04-20 19:15:02.887663+03	\N	0	0	0	normal
422	1	2025-04-20 19:15:02.906253+03	\N	0	0	0	normal
423	1	2025-04-20 19:15:02.927593+03	\N	0	0	0	normal
424	1	2025-04-20 19:15:02.964157+03	\N	0	0	0	normal
425	1	2025-04-20 19:15:02.990618+03	\N	0	0	0	normal
426	1	2025-04-20 19:15:03.006436+03	\N	0	0	0	normal
427	1	2025-04-20 19:15:03.027186+03	\N	0	0	0	normal
428	1	2025-04-20 19:15:03.044281+03	\N	0	0	0	normal
429	1	2025-04-20 19:15:03.060553+03	\N	0	0	0	normal
430	1	2025-04-20 19:15:03.075673+03	\N	0	0	0	normal
431	1	2025-04-20 19:15:03.089296+03	\N	0	0	0	normal
1269	2	2025-04-21 11:58:26.16727+03	\N	0	0	0	normal
432	1	2025-04-20 19:15:06.086182+03	\N	2	2	0	normal
433	1	2025-04-20 19:19:18.209813+03	\N	0	0	0	normal
434	1	2025-04-20 19:19:23.128509+03	\N	0	0	0	normal
435	1	2025-04-20 19:23:45.384497+03	\N	0	0	0	normal
436	1	2025-04-20 19:23:45.408864+03	\N	0	0	0	normal
437	1	2025-04-20 19:23:45.427595+03	\N	0	0	0	normal
438	1	2025-04-20 19:23:45.444202+03	\N	0	0	0	normal
439	1	2025-04-20 19:23:45.460593+03	\N	0	0	0	normal
440	1	2025-04-20 19:23:45.479185+03	\N	0	0	0	normal
441	1	2025-04-20 19:23:45.494514+03	\N	0	0	0	normal
442	1	2025-04-20 19:23:45.509522+03	\N	0	0	0	normal
443	1	2025-04-20 19:23:45.524462+03	\N	0	0	0	normal
444	1	2025-04-20 19:23:45.543366+03	\N	0	0	0	normal
445	1	2025-04-20 19:23:45.558657+03	\N	0	0	0	normal
446	1	2025-04-20 19:23:45.574688+03	\N	0	0	0	normal
447	1	2025-04-20 19:23:45.586805+03	\N	0	0	0	normal
448	1	2025-04-20 19:23:45.603381+03	\N	0	0	0	normal
449	1	2025-04-20 19:23:45.640602+03	\N	0	0	0	normal
450	1	2025-04-20 19:23:45.656011+03	\N	0	0	0	normal
451	1	2025-04-20 19:23:45.669608+03	\N	0	0	0	normal
452	1	2025-04-20 19:23:45.68525+03	\N	0	0	0	normal
453	1	2025-04-20 19:23:45.701629+03	\N	0	0	0	normal
454	1	2025-04-20 19:23:45.715081+03	\N	0	0	0	normal
455	1	2025-04-20 19:23:45.727949+03	\N	0	0	0	normal
456	1	2025-04-20 19:23:45.743427+03	\N	0	0	0	normal
457	1	2025-04-20 19:23:45.759211+03	\N	0	0	0	normal
458	1	2025-04-20 19:23:45.77002+03	\N	0	0	0	normal
459	1	2025-04-20 19:23:45.874804+03	\N	0	0	0	normal
460	1	2025-04-20 19:23:45.906424+03	\N	0	0	0	normal
461	1	2025-04-20 19:23:45.915591+03	\N	0	0	0	normal
462	1	2025-04-20 19:23:45.933544+03	\N	0	0	0	normal
463	1	2025-04-20 19:23:45.961745+03	\N	0	0	0	normal
464	1	2025-04-20 19:23:45.981199+03	\N	0	0	0	normal
465	1	2025-04-20 19:23:46.007571+03	\N	0	0	0	normal
466	1	2025-04-20 19:23:46.021127+03	\N	0	0	0	normal
467	1	2025-04-20 19:23:46.039903+03	\N	0	0	0	normal
468	1	2025-04-20 19:23:46.066967+03	\N	0	0	0	normal
469	1	2025-04-20 19:23:46.089118+03	\N	0	0	0	normal
470	1	2025-04-20 19:23:46.104939+03	\N	0	0	0	normal
471	1	2025-04-20 19:23:46.12759+03	\N	0	0	0	normal
472	1	2025-04-20 19:23:46.144983+03	\N	0	0	0	normal
1270	2	2025-04-21 11:58:26.19443+03	\N	0	0	0	normal
473	1	2025-04-20 19:23:46.176552+03	\N	0	0	0	normal
474	1	2025-04-20 19:23:46.193782+03	\N	0	0	0	normal
475	1	2025-04-20 19:23:46.211217+03	\N	0	0	0	normal
476	1	2025-04-20 19:23:46.226705+03	\N	0	0	0	normal
477	1	2025-04-20 19:23:46.240453+03	\N	0	0	0	normal
478	1	2025-04-20 19:23:46.254747+03	\N	0	0	0	normal
479	1	2025-04-20 19:23:46.268768+03	\N	0	0	0	normal
480	1	2025-04-20 19:23:46.2812+03	\N	0	0	0	normal
481	1	2025-04-20 19:23:46.296546+03	\N	0	0	0	normal
482	1	2025-04-20 19:23:46.311595+03	\N	0	0	0	normal
483	1	2025-04-20 19:23:46.329604+03	\N	0	0	0	normal
484	1	2025-04-20 19:23:46.347664+03	\N	0	0	0	normal
485	1	2025-04-20 19:23:46.36209+03	\N	0	0	0	normal
486	1	2025-04-20 19:23:46.380287+03	\N	0	0	0	normal
487	1	2025-04-20 19:23:46.408465+03	\N	0	0	0	normal
488	1	2025-04-20 19:23:46.424836+03	\N	0	0	0	normal
489	1	2025-04-20 19:23:46.447565+03	\N	0	0	0	normal
490	1	2025-04-20 19:23:46.462363+03	\N	0	0	0	normal
491	1	2025-04-20 19:23:46.524611+03	\N	0	0	0	normal
492	1	2025-04-20 19:23:46.560997+03	\N	0	0	0	normal
493	1	2025-04-20 19:23:46.583011+03	\N	0	0	0	normal
494	1	2025-04-20 19:23:46.602865+03	\N	0	0	0	normal
495	1	2025-04-20 19:23:46.618133+03	\N	0	0	0	normal
496	1	2025-04-20 19:23:46.651008+03	\N	0	0	0	normal
497	1	2025-04-20 19:23:46.664891+03	\N	0	0	0	normal
498	1	2025-04-20 19:23:46.68074+03	\N	0	0	0	normal
499	1	2025-04-20 19:23:46.699246+03	\N	0	0	0	normal
500	1	2025-04-20 19:23:46.733569+03	\N	0	0	0	normal
501	1	2025-04-20 19:23:46.749256+03	\N	0	0	0	normal
502	1	2025-04-20 19:23:46.765481+03	\N	0	0	0	normal
503	1	2025-04-20 19:23:46.781843+03	\N	0	0	0	normal
504	1	2025-04-20 19:23:46.798035+03	\N	0	0	0	normal
505	1	2025-04-20 19:23:46.814772+03	\N	0	0	0	normal
506	1	2025-04-20 19:23:46.833529+03	\N	0	0	0	normal
507	1	2025-04-20 19:23:46.850272+03	\N	0	0	0	normal
508	1	2025-04-20 19:23:46.866081+03	\N	0	0	0	normal
509	1	2025-04-20 19:23:46.882627+03	\N	0	0	0	normal
510	1	2025-04-20 19:23:46.899717+03	\N	0	0	0	normal
511	1	2025-04-20 19:23:46.918144+03	\N	0	0	0	normal
512	1	2025-04-20 19:23:46.941029+03	\N	0	0	0	normal
513	1	2025-04-20 19:23:46.974405+03	\N	0	0	0	normal
514	1	2025-04-20 19:23:47.004308+03	\N	0	0	0	normal
515	1	2025-04-20 19:23:47.017084+03	\N	0	0	0	normal
516	1	2025-04-20 19:23:47.035874+03	\N	0	0	0	normal
517	1	2025-04-20 19:23:47.049799+03	\N	0	0	0	normal
518	1	2025-04-20 19:23:47.065527+03	\N	0	0	0	normal
519	1	2025-04-20 19:23:47.081486+03	\N	0	0	0	normal
520	1	2025-04-20 19:23:47.112722+03	\N	0	0	0	normal
521	1	2025-04-20 19:23:47.147652+03	\N	0	0	0	normal
522	1	2025-04-20 19:23:47.166855+03	\N	0	0	0	normal
523	1	2025-04-20 19:23:47.185353+03	\N	0	0	0	normal
524	1	2025-04-20 19:23:47.207726+03	\N	0	0	0	normal
525	1	2025-04-20 19:23:47.239826+03	\N	0	0	0	normal
526	1	2025-04-20 19:23:47.260729+03	\N	0	0	0	normal
527	1	2025-04-20 19:23:47.278012+03	\N	0	0	0	normal
528	1	2025-04-20 19:23:47.312701+03	\N	0	0	0	normal
529	1	2025-04-20 19:23:47.345201+03	\N	0	0	0	normal
530	1	2025-04-20 19:23:47.400499+03	\N	0	0	0	normal
531	1	2025-04-20 19:23:47.416457+03	\N	0	0	0	normal
532	1	2025-04-20 19:23:47.434807+03	\N	0	0	0	normal
533	1	2025-04-20 19:23:47.45042+03	\N	0	0	0	normal
534	1	2025-04-20 19:23:47.468881+03	\N	0	0	0	normal
535	1	2025-04-20 19:23:47.495531+03	\N	0	0	0	normal
536	1	2025-04-20 19:23:47.525812+03	\N	0	0	0	normal
537	1	2025-04-20 19:23:47.541637+03	\N	0	0	0	normal
538	1	2025-04-20 19:23:47.576725+03	\N	0	0	0	normal
539	1	2025-04-20 19:23:47.593257+03	\N	0	0	0	normal
540	1	2025-04-20 19:23:47.610352+03	\N	0	0	0	normal
541	1	2025-04-20 19:23:47.669281+03	\N	0	0	0	normal
542	1	2025-04-20 19:23:47.695331+03	\N	0	0	0	normal
543	1	2025-04-20 19:23:47.718929+03	\N	0	0	0	normal
544	1	2025-04-20 19:23:47.735721+03	\N	0	0	0	normal
545	1	2025-04-20 19:23:47.757258+03	\N	0	0	0	normal
546	1	2025-04-20 19:23:47.769267+03	\N	0	0	0	normal
547	1	2025-04-20 19:23:47.785893+03	\N	0	0	0	normal
548	1	2025-04-20 19:23:47.801315+03	\N	0	0	0	normal
549	1	2025-04-20 19:23:47.819708+03	\N	0	0	0	normal
550	1	2025-04-20 19:23:47.836203+03	\N	0	0	0	normal
551	1	2025-04-20 19:23:47.852937+03	\N	0	0	0	normal
552	1	2025-04-20 19:23:47.878078+03	\N	0	0	0	normal
553	1	2025-04-20 19:23:47.894463+03	\N	0	0	0	normal
554	1	2025-04-20 19:23:47.907892+03	\N	0	0	0	normal
555	1	2025-04-20 19:23:47.920717+03	\N	0	0	0	normal
556	1	2025-04-20 19:23:47.937197+03	\N	0	0	0	normal
557	1	2025-04-20 19:23:47.999231+03	\N	0	0	0	normal
558	1	2025-04-20 19:23:48.016428+03	\N	0	0	0	normal
559	1	2025-04-20 19:23:48.035922+03	\N	0	0	0	normal
560	1	2025-04-20 19:23:48.075363+03	\N	0	0	0	normal
561	1	2025-04-20 19:23:48.087061+03	\N	0	0	0	normal
562	1	2025-04-20 19:23:48.114616+03	\N	0	0	0	normal
563	1	2025-04-20 19:23:48.134808+03	\N	0	0	0	normal
564	1	2025-04-20 19:23:48.165989+03	\N	0	0	0	normal
565	1	2025-04-20 19:23:48.186158+03	\N	0	0	0	normal
566	1	2025-04-20 19:23:48.211694+03	\N	0	0	0	normal
567	1	2025-04-20 19:23:48.229284+03	\N	0	0	0	normal
568	1	2025-04-20 19:23:48.24892+03	\N	0	0	0	normal
569	1	2025-04-20 19:23:48.266608+03	\N	0	0	0	normal
570	1	2025-04-20 19:23:48.28324+03	\N	0	0	0	normal
571	1	2025-04-20 19:23:48.302195+03	\N	0	0	0	normal
572	1	2025-04-20 19:23:48.327509+03	\N	0	0	0	normal
573	1	2025-04-20 19:23:48.338182+03	\N	0	0	0	normal
574	1	2025-04-20 19:23:48.364826+03	\N	0	0	0	normal
575	1	2025-04-20 19:23:48.384165+03	\N	0	0	0	normal
576	1	2025-04-20 19:23:48.429339+03	\N	0	0	0	normal
577	1	2025-04-20 19:23:48.444519+03	\N	0	0	0	normal
578	1	2025-04-20 19:23:48.465324+03	\N	0	0	0	normal
579	1	2025-04-20 19:23:48.486327+03	\N	0	0	0	normal
580	1	2025-04-20 19:23:48.502466+03	\N	0	0	0	normal
581	1	2025-04-20 19:23:51.34947+03	\N	0	0	0	normal
582	1	2025-04-20 19:24:41.440816+03	\N	0	0	0	normal
583	1	2025-04-20 19:24:41.480282+03	\N	0	0	0	normal
584	1	2025-04-20 19:24:41.497762+03	\N	0	0	0	normal
585	1	2025-04-20 19:24:41.514838+03	\N	0	0	0	normal
586	1	2025-04-20 19:24:41.530665+03	\N	0	0	0	normal
587	1	2025-04-20 19:24:41.546033+03	\N	0	0	0	normal
588	1	2025-04-20 19:24:41.562442+03	\N	0	0	0	normal
589	1	2025-04-20 19:24:41.579521+03	\N	0	0	0	normal
590	1	2025-04-20 19:24:41.594278+03	\N	0	0	0	normal
591	1	2025-04-20 19:24:41.612706+03	\N	0	0	0	normal
592	1	2025-04-20 19:24:41.643065+03	\N	0	0	0	normal
593	1	2025-04-20 19:24:41.658054+03	\N	0	0	0	normal
594	1	2025-04-20 19:24:41.669244+03	\N	0	0	0	normal
595	1	2025-04-20 19:24:41.681788+03	\N	0	0	0	normal
596	1	2025-04-20 19:24:41.698551+03	\N	0	0	0	normal
597	1	2025-04-20 19:24:41.71589+03	\N	0	0	0	normal
598	1	2025-04-20 19:24:41.732336+03	\N	0	0	0	normal
599	1	2025-04-20 19:24:41.748265+03	\N	0	0	0	normal
600	1	2025-04-20 19:24:41.764937+03	\N	0	0	0	normal
601	1	2025-04-20 19:24:41.780531+03	\N	0	0	0	normal
602	1	2025-04-20 19:24:41.797815+03	\N	0	0	0	normal
603	1	2025-04-20 19:24:41.815419+03	\N	0	0	0	normal
604	1	2025-04-20 19:24:41.831171+03	\N	0	0	0	normal
605	1	2025-04-20 19:24:41.848526+03	\N	0	0	0	normal
606	1	2025-04-20 19:24:41.865731+03	\N	0	0	0	normal
607	1	2025-04-20 19:24:41.88288+03	\N	0	0	0	normal
608	1	2025-04-20 19:24:41.900268+03	\N	0	0	0	normal
609	1	2025-04-20 19:24:41.916993+03	\N	0	0	0	normal
610	1	2025-04-20 19:24:41.940001+03	\N	0	0	0	normal
611	1	2025-04-20 19:24:41.986115+03	\N	0	0	0	normal
612	1	2025-04-20 19:24:42.003976+03	\N	0	0	0	normal
613	1	2025-04-20 19:24:42.018443+03	\N	0	0	0	normal
614	1	2025-04-20 19:24:42.033756+03	\N	0	0	0	normal
615	1	2025-04-20 19:24:42.064058+03	\N	0	0	0	normal
616	1	2025-04-20 19:24:42.07854+03	\N	0	0	0	normal
617	1	2025-04-20 19:24:42.094603+03	\N	0	0	0	normal
618	1	2025-04-20 19:24:42.108711+03	\N	0	0	0	normal
619	1	2025-04-20 19:24:42.119234+03	\N	0	0	0	normal
620	1	2025-04-20 19:24:42.135402+03	\N	0	0	0	normal
621	1	2025-04-20 19:24:42.160468+03	\N	0	0	0	normal
622	1	2025-04-20 19:24:42.17664+03	\N	0	0	0	normal
623	1	2025-04-20 19:24:42.18761+03	\N	0	0	0	normal
624	1	2025-04-20 19:24:42.198658+03	\N	0	0	0	normal
625	1	2025-04-20 19:24:42.214097+03	\N	0	0	0	normal
626	1	2025-04-20 19:24:42.23049+03	\N	0	0	0	normal
627	1	2025-04-20 19:24:42.246742+03	\N	0	0	0	normal
628	1	2025-04-20 19:24:42.264385+03	\N	0	0	0	normal
629	1	2025-04-20 19:24:42.282201+03	\N	0	0	0	normal
630	1	2025-04-20 19:24:42.298139+03	\N	0	0	0	normal
631	1	2025-04-20 19:24:42.314912+03	\N	0	0	0	normal
632	1	2025-04-20 19:24:42.332131+03	\N	0	0	0	normal
633	1	2025-04-20 19:24:42.348223+03	\N	0	0	0	normal
634	1	2025-04-20 19:24:42.364012+03	\N	0	0	0	normal
635	1	2025-04-20 19:24:42.38442+03	\N	0	0	0	normal
636	1	2025-04-20 19:24:42.424213+03	\N	0	0	0	normal
637	1	2025-04-20 19:24:42.435312+03	\N	0	0	0	normal
638	1	2025-04-20 19:24:42.452304+03	\N	0	0	0	normal
639	1	2025-04-20 19:24:42.467241+03	\N	0	0	0	normal
640	1	2025-04-20 19:24:42.517241+03	\N	0	0	0	normal
641	1	2025-04-20 19:24:42.53434+03	\N	0	0	0	normal
642	1	2025-04-20 19:24:42.559414+03	\N	0	0	0	normal
643	1	2025-04-20 19:24:42.577879+03	\N	0	0	0	normal
644	1	2025-04-20 19:24:42.601297+03	\N	0	0	0	normal
645	1	2025-04-20 19:24:42.645169+03	\N	0	0	0	normal
646	1	2025-04-20 19:24:42.66257+03	\N	0	0	0	normal
647	1	2025-04-20 19:24:42.682371+03	\N	0	0	0	normal
648	1	2025-04-20 19:24:42.706087+03	\N	0	0	0	normal
649	1	2025-04-20 19:24:42.731093+03	\N	0	0	0	normal
650	1	2025-04-20 19:24:42.748002+03	\N	0	0	0	normal
651	1	2025-04-20 19:24:42.765536+03	\N	0	0	0	normal
652	1	2025-04-20 19:24:42.78245+03	\N	0	0	0	normal
653	1	2025-04-20 19:24:42.800663+03	\N	0	0	0	normal
654	1	2025-04-20 19:24:42.818126+03	\N	0	0	0	normal
655	1	2025-04-20 19:24:42.843202+03	\N	0	0	0	normal
656	1	2025-04-20 19:24:42.861083+03	\N	0	0	0	normal
657	1	2025-04-20 19:24:42.879073+03	\N	0	0	0	normal
658	1	2025-04-20 19:24:42.896146+03	\N	0	0	0	normal
659	1	2025-04-20 19:24:42.914566+03	\N	0	0	0	normal
660	1	2025-04-20 19:24:42.936767+03	\N	0	0	0	normal
661	1	2025-04-20 19:24:42.965508+03	\N	0	0	0	normal
662	1	2025-04-20 19:24:42.984725+03	\N	0	0	0	normal
663	1	2025-04-20 19:24:43.024758+03	\N	0	0	0	normal
664	1	2025-04-20 19:24:43.040885+03	\N	0	0	0	normal
665	1	2025-04-20 19:24:43.054653+03	\N	0	0	0	normal
666	1	2025-04-20 19:24:43.067938+03	\N	0	0	0	normal
667	1	2025-04-20 19:24:43.095907+03	\N	0	0	0	normal
668	1	2025-04-20 19:24:43.202761+03	\N	0	0	0	normal
669	1	2025-04-20 19:24:46.05743+03	\N	0	0	0	normal
670	1	2025-04-20 19:24:52.633348+03	\N	0	0	0	normal
671	1	2025-04-21 11:42:39.783713+03	\N	0	0	0	normal
672	1	2025-04-21 11:42:47.454954+03	\N	0	0	0	normal
673	1	2025-04-21 11:42:50.893404+03	\N	0	0	0	normal
1271	2	2025-04-21 11:58:26.219636+03	\N	0	0	0	normal
678	2	2025-04-21 11:52:51.794259+03	2025-04-21 11:53:30.772447+03	5	4	60	normal
679	2	2025-04-21 11:53:44.893694+03	\N	0	0	0	normal
680	2	2025-04-21 11:57:01.272781+03	\N	0	0	0	normal
681	2	2025-04-21 11:57:37.638599+03	\N	0	0	0	normal
674	1	2025-04-21 11:42:53.452326+03	2025-04-21 11:43:28.996223+03	5	5	75	normal
682	2	2025-04-21 11:57:37.680073+03	\N	0	0	0	normal
683	2	2025-04-21 11:57:37.698359+03	\N	0	0	0	normal
684	2	2025-04-21 11:57:37.714736+03	\N	0	0	0	normal
685	2	2025-04-21 11:57:37.730433+03	\N	0	0	0	normal
686	2	2025-04-21 11:57:37.74624+03	\N	0	0	0	normal
675	2	2025-04-21 11:44:13.914359+03	2025-04-21 11:44:39.484472+03	5	5	50	normal
676	2	2025-04-21 11:50:35.251665+03	\N	0	0	0	normal
687	2	2025-04-21 11:57:37.76299+03	\N	0	0	0	normal
688	2	2025-04-21 11:57:37.780513+03	\N	0	0	0	normal
689	2	2025-04-21 11:57:37.795862+03	\N	0	0	0	normal
690	2	2025-04-21 11:57:37.812927+03	\N	0	0	0	normal
691	2	2025-04-21 11:57:37.82955+03	\N	0	0	0	normal
677	2	2025-04-21 11:50:46.904803+03	2025-04-21 11:51:10.511333+03	5	5	0	normal
692	2	2025-04-21 11:57:37.854709+03	\N	0	0	0	normal
693	2	2025-04-21 11:57:37.879831+03	\N	0	0	0	normal
694	2	2025-04-21 11:57:37.895517+03	\N	0	0	0	normal
1272	2	2025-04-21 11:58:26.237632+03	\N	0	0	0	normal
695	2	2025-04-21 11:57:37.91201+03	\N	0	0	0	normal
696	2	2025-04-21 11:57:37.92961+03	\N	0	0	0	normal
697	2	2025-04-21 11:57:37.947924+03	\N	0	0	0	normal
698	2	2025-04-21 11:57:37.963778+03	\N	0	0	0	normal
699	2	2025-04-21 11:57:37.979572+03	\N	0	0	0	normal
700	2	2025-04-21 11:57:37.99575+03	\N	0	0	0	normal
701	2	2025-04-21 11:57:38.013152+03	\N	0	0	0	normal
702	2	2025-04-21 11:57:38.030518+03	\N	0	0	0	normal
703	2	2025-04-21 11:57:38.046416+03	\N	0	0	0	normal
704	2	2025-04-21 11:57:38.063317+03	\N	0	0	0	normal
705	2	2025-04-21 11:57:38.08074+03	\N	0	0	0	normal
706	2	2025-04-21 11:57:38.09701+03	\N	0	0	0	normal
707	2	2025-04-21 11:57:38.113703+03	\N	0	0	0	normal
708	2	2025-04-21 11:57:38.129201+03	\N	0	0	0	normal
709	2	2025-04-21 11:57:38.145844+03	\N	0	0	0	normal
710	2	2025-04-21 11:57:38.162288+03	\N	0	0	0	normal
711	2	2025-04-21 11:57:38.179252+03	\N	0	0	0	normal
712	2	2025-04-21 11:57:38.196266+03	\N	0	0	0	normal
713	2	2025-04-21 11:57:38.211767+03	\N	0	0	0	normal
714	2	2025-04-21 11:57:38.228693+03	\N	0	0	0	normal
715	2	2025-04-21 11:57:38.245185+03	\N	0	0	0	normal
716	2	2025-04-21 11:57:38.262272+03	\N	0	0	0	normal
717	2	2025-04-21 11:57:38.278076+03	\N	0	0	0	normal
718	2	2025-04-21 11:57:38.304065+03	\N	0	0	0	normal
719	2	2025-04-21 11:57:38.318677+03	\N	0	0	0	normal
720	2	2025-04-21 11:57:38.336422+03	\N	0	0	0	normal
721	2	2025-04-21 11:57:38.350028+03	\N	0	0	0	normal
722	2	2025-04-21 11:57:38.367296+03	\N	0	0	0	normal
723	2	2025-04-21 11:57:38.379092+03	\N	0	0	0	normal
724	2	2025-04-21 11:57:38.395046+03	\N	0	0	0	normal
725	2	2025-04-21 11:57:38.411777+03	\N	0	0	0	normal
726	2	2025-04-21 11:57:38.427874+03	\N	0	0	0	normal
727	2	2025-04-21 11:57:38.445091+03	\N	0	0	0	normal
728	2	2025-04-21 11:57:38.463392+03	\N	0	0	0	normal
729	2	2025-04-21 11:57:38.542306+03	\N	0	0	0	normal
730	2	2025-04-21 11:57:38.554838+03	\N	0	0	0	normal
731	2	2025-04-21 11:57:38.571195+03	\N	0	0	0	normal
732	2	2025-04-21 11:57:38.588964+03	\N	0	0	0	normal
733	2	2025-04-21 11:57:38.604881+03	\N	0	0	0	normal
734	2	2025-04-21 11:57:38.62139+03	\N	0	0	0	normal
735	2	2025-04-21 11:57:38.637001+03	\N	0	0	0	normal
736	2	2025-04-21 11:57:38.654103+03	\N	0	0	0	normal
737	2	2025-04-21 11:57:38.671101+03	\N	0	0	0	normal
738	2	2025-04-21 11:57:38.687567+03	\N	0	0	0	normal
739	2	2025-04-21 11:57:38.716759+03	\N	0	0	0	normal
740	2	2025-04-21 11:57:38.734248+03	\N	0	0	0	normal
741	2	2025-04-21 11:57:38.751413+03	\N	0	0	0	normal
742	2	2025-04-21 11:57:38.768624+03	\N	0	0	0	normal
743	2	2025-04-21 11:57:38.796493+03	\N	0	0	0	normal
744	2	2025-04-21 11:57:38.811641+03	\N	0	0	0	normal
745	2	2025-04-21 11:57:38.828472+03	\N	0	0	0	normal
746	2	2025-04-21 11:57:38.844046+03	\N	0	0	0	normal
747	2	2025-04-21 11:57:38.857271+03	\N	0	0	0	normal
748	2	2025-04-21 11:57:38.87365+03	\N	0	0	0	normal
749	2	2025-04-21 11:57:38.889259+03	\N	0	0	0	normal
750	2	2025-04-21 11:57:38.904198+03	\N	0	0	0	normal
751	2	2025-04-21 11:57:38.920167+03	\N	0	0	0	normal
752	2	2025-04-21 11:57:38.936073+03	\N	0	0	0	normal
753	2	2025-04-21 11:57:38.954626+03	\N	0	0	0	normal
754	2	2025-04-21 11:57:38.970801+03	\N	0	0	0	normal
755	2	2025-04-21 11:57:38.986644+03	\N	0	0	0	normal
756	2	2025-04-21 11:57:39.004095+03	\N	0	0	0	normal
757	2	2025-04-21 11:57:39.019613+03	\N	0	0	0	normal
758	2	2025-04-21 11:57:39.030505+03	\N	0	0	0	normal
759	2	2025-04-21 11:57:39.045571+03	\N	0	0	0	normal
760	2	2025-04-21 11:57:39.06145+03	\N	0	0	0	normal
761	2	2025-04-21 11:57:39.079156+03	\N	0	0	0	normal
762	2	2025-04-21 11:57:39.093882+03	\N	0	0	0	normal
763	2	2025-04-21 11:57:39.110987+03	\N	0	0	0	normal
764	2	2025-04-21 11:57:39.128259+03	\N	0	0	0	normal
765	2	2025-04-21 11:57:39.191715+03	\N	0	0	0	normal
766	2	2025-04-21 11:57:39.219839+03	\N	0	0	0	normal
767	2	2025-04-21 11:57:39.238825+03	\N	0	0	0	normal
768	2	2025-04-21 11:57:39.253814+03	\N	0	0	0	normal
769	2	2025-04-21 11:57:39.265075+03	\N	0	0	0	normal
770	2	2025-04-21 11:57:39.279041+03	\N	0	0	0	normal
771	2	2025-04-21 11:57:39.29487+03	\N	0	0	0	normal
772	2	2025-04-21 11:57:39.312359+03	\N	0	0	0	normal
773	2	2025-04-21 11:57:39.328725+03	\N	0	0	0	normal
774	2	2025-04-21 11:57:39.344305+03	\N	0	0	0	normal
775	2	2025-04-21 11:57:39.361702+03	\N	0	0	0	normal
776	2	2025-04-21 11:57:39.378556+03	\N	0	0	0	normal
777	2	2025-04-21 11:57:39.395398+03	\N	0	0	0	normal
778	2	2025-04-21 11:57:39.410915+03	\N	0	0	0	normal
779	2	2025-04-21 11:57:39.426205+03	\N	0	0	0	normal
780	2	2025-04-21 11:57:39.439634+03	\N	0	0	0	normal
781	2	2025-04-21 11:57:39.454402+03	\N	0	0	0	normal
782	2	2025-04-21 11:57:39.469756+03	\N	0	0	0	normal
783	2	2025-04-21 11:57:39.486574+03	\N	0	0	0	normal
784	2	2025-04-21 11:57:39.503008+03	\N	0	0	0	normal
785	2	2025-04-21 11:57:39.513911+03	\N	0	0	0	normal
786	2	2025-04-21 11:57:39.529042+03	\N	0	0	0	normal
787	2	2025-04-21 11:57:39.544925+03	\N	0	0	0	normal
788	2	2025-04-21 11:57:39.558811+03	\N	0	0	0	normal
789	2	2025-04-21 11:57:39.57513+03	\N	0	0	0	normal
790	2	2025-04-21 11:57:39.589475+03	\N	0	0	0	normal
791	2	2025-04-21 11:57:39.604187+03	\N	0	0	0	normal
792	2	2025-04-21 11:57:39.619541+03	\N	0	0	0	normal
793	2	2025-04-21 11:57:39.636271+03	\N	0	0	0	normal
794	2	2025-04-21 11:57:39.652543+03	\N	0	0	0	normal
795	2	2025-04-21 11:57:39.67627+03	\N	0	0	0	normal
796	2	2025-04-21 11:57:39.693425+03	\N	0	0	0	normal
797	2	2025-04-21 11:57:39.70666+03	\N	0	0	0	normal
798	2	2025-04-21 11:57:39.721781+03	\N	0	0	0	normal
799	2	2025-04-21 11:57:39.737154+03	\N	0	0	0	normal
800	2	2025-04-21 11:57:39.753837+03	\N	0	0	0	normal
801	2	2025-04-21 11:57:39.76944+03	\N	0	0	0	normal
802	2	2025-04-21 11:57:39.785706+03	\N	0	0	0	normal
803	2	2025-04-21 11:57:39.797957+03	\N	0	0	0	normal
804	2	2025-04-21 11:57:39.812094+03	\N	0	0	0	normal
805	2	2025-04-21 11:57:39.828734+03	\N	0	0	0	normal
806	2	2025-04-21 11:57:39.847609+03	\N	0	0	0	normal
807	2	2025-04-21 11:57:39.87681+03	\N	0	0	0	normal
808	2	2025-04-21 11:57:39.88779+03	\N	0	0	0	normal
809	2	2025-04-21 11:57:39.90338+03	\N	0	0	0	normal
810	2	2025-04-21 11:57:39.921071+03	\N	0	0	0	normal
811	2	2025-04-21 11:57:39.939244+03	\N	0	0	0	normal
812	2	2025-04-21 11:57:39.955302+03	\N	0	0	0	normal
813	2	2025-04-21 11:57:39.970818+03	\N	0	0	0	normal
814	2	2025-04-21 11:57:39.987718+03	\N	0	0	0	normal
815	2	2025-04-21 11:57:40.015643+03	\N	0	0	0	normal
816	2	2025-04-21 11:57:40.028373+03	\N	0	0	0	normal
817	2	2025-04-21 11:57:40.04493+03	\N	0	0	0	normal
818	2	2025-04-21 11:57:40.063183+03	\N	0	0	0	normal
819	2	2025-04-21 11:57:40.093694+03	\N	0	0	0	normal
820	2	2025-04-21 11:57:40.108125+03	\N	0	0	0	normal
821	2	2025-04-21 11:57:40.123991+03	\N	0	0	0	normal
822	2	2025-04-21 11:57:40.144548+03	\N	0	0	0	normal
823	2	2025-04-21 11:57:40.161776+03	\N	0	0	0	normal
824	2	2025-04-21 11:57:40.177627+03	\N	0	0	0	normal
825	2	2025-04-21 11:57:40.193081+03	\N	0	0	0	normal
826	2	2025-04-21 11:57:40.206851+03	\N	0	0	0	normal
827	2	2025-04-21 11:57:40.224752+03	\N	0	0	0	normal
828	2	2025-04-21 11:57:40.239258+03	\N	0	0	0	normal
829	2	2025-04-21 11:57:40.253943+03	\N	0	0	0	normal
830	2	2025-04-21 11:57:40.271405+03	\N	0	0	0	normal
831	2	2025-04-21 11:57:40.287332+03	\N	0	0	0	normal
832	2	2025-04-21 11:57:40.309488+03	\N	0	0	0	normal
833	2	2025-04-21 11:57:40.322954+03	\N	0	0	0	normal
834	2	2025-04-21 11:57:40.337413+03	\N	0	0	0	normal
835	2	2025-04-21 11:57:40.353097+03	\N	0	0	0	normal
836	2	2025-04-21 11:57:40.365486+03	\N	0	0	0	normal
837	2	2025-04-21 11:57:40.379794+03	\N	0	0	0	normal
838	2	2025-04-21 11:57:40.395559+03	\N	0	0	0	normal
839	2	2025-04-21 11:57:40.411475+03	\N	0	0	0	normal
840	2	2025-04-21 11:57:40.427692+03	\N	0	0	0	normal
841	2	2025-04-21 11:57:40.443348+03	\N	0	0	0	normal
842	2	2025-04-21 11:57:40.456603+03	\N	0	0	0	normal
843	2	2025-04-21 11:57:40.47643+03	\N	0	0	0	normal
844	2	2025-04-21 11:57:40.49409+03	\N	0	0	0	normal
845	2	2025-04-21 11:57:40.513826+03	\N	0	0	0	normal
846	2	2025-04-21 11:57:40.529059+03	\N	0	0	0	normal
847	2	2025-04-21 11:57:40.544612+03	\N	0	0	0	normal
848	2	2025-04-21 11:57:40.562857+03	\N	0	0	0	normal
849	2	2025-04-21 11:57:40.578706+03	\N	0	0	0	normal
850	2	2025-04-21 11:57:40.592296+03	\N	0	0	0	normal
851	2	2025-04-21 11:57:40.607496+03	\N	0	0	0	normal
852	2	2025-04-21 11:57:40.62516+03	\N	0	0	0	normal
853	2	2025-04-21 11:57:40.637918+03	\N	0	0	0	normal
854	2	2025-04-21 11:57:40.653383+03	\N	0	0	0	normal
855	2	2025-04-21 11:57:40.669087+03	\N	0	0	0	normal
856	2	2025-04-21 11:57:40.680478+03	\N	0	0	0	normal
857	2	2025-04-21 11:57:40.694769+03	\N	0	0	0	normal
858	2	2025-04-21 11:57:40.707908+03	\N	0	0	0	normal
859	2	2025-04-21 11:57:40.724013+03	\N	0	0	0	normal
860	2	2025-04-21 11:57:40.739994+03	\N	0	0	0	normal
861	2	2025-04-21 11:57:40.755758+03	\N	0	0	0	normal
862	2	2025-04-21 11:57:40.774726+03	\N	0	0	0	normal
863	2	2025-04-21 11:57:40.792491+03	\N	0	0	0	normal
864	2	2025-04-21 11:57:40.987393+03	\N	0	0	0	normal
865	2	2025-04-21 11:57:41.005028+03	\N	0	0	0	normal
866	2	2025-04-21 11:57:41.025062+03	\N	0	0	0	normal
867	2	2025-04-21 11:57:41.043883+03	\N	0	0	0	normal
868	2	2025-04-21 11:57:41.061229+03	\N	0	0	0	normal
869	2	2025-04-21 11:57:41.075872+03	\N	0	0	0	normal
870	2	2025-04-21 11:57:41.102819+03	\N	0	0	0	normal
871	2	2025-04-21 11:57:41.130074+03	\N	0	0	0	normal
872	2	2025-04-21 11:57:41.159744+03	\N	0	0	0	normal
873	2	2025-04-21 11:57:41.192312+03	\N	0	0	0	normal
874	2	2025-04-21 11:57:41.277818+03	\N	0	0	0	normal
875	2	2025-04-21 11:57:41.294081+03	\N	0	0	0	normal
876	2	2025-04-21 11:57:41.312339+03	\N	0	0	0	normal
877	2	2025-04-21 11:57:41.324697+03	\N	0	0	0	normal
878	2	2025-04-21 11:57:41.340781+03	\N	0	0	0	normal
879	2	2025-04-21 11:57:41.356672+03	\N	0	0	0	normal
880	2	2025-04-21 11:57:41.371021+03	\N	0	0	0	normal
881	2	2025-04-21 11:57:41.39089+03	\N	0	0	0	normal
882	2	2025-04-21 11:57:41.411214+03	\N	0	0	0	normal
883	2	2025-04-21 11:57:41.429197+03	\N	0	0	0	normal
884	2	2025-04-21 11:57:41.446461+03	\N	0	0	0	normal
885	2	2025-04-21 11:57:41.469907+03	\N	0	0	0	normal
886	2	2025-04-21 11:57:41.485241+03	\N	0	0	0	normal
887	2	2025-04-21 11:57:41.500875+03	\N	0	0	0	normal
888	2	2025-04-21 11:57:41.512581+03	\N	0	0	0	normal
889	2	2025-04-21 11:57:41.528614+03	\N	0	0	0	normal
890	2	2025-04-21 11:57:41.547139+03	\N	0	0	0	normal
891	2	2025-04-21 11:57:41.563928+03	\N	0	0	0	normal
892	2	2025-04-21 11:57:41.587919+03	\N	0	0	0	normal
893	2	2025-04-21 11:57:41.604948+03	\N	0	0	0	normal
894	2	2025-04-21 11:57:41.623449+03	\N	0	0	0	normal
895	2	2025-04-21 11:57:41.639895+03	\N	0	0	0	normal
896	2	2025-04-21 11:57:41.662936+03	\N	0	0	0	normal
897	2	2025-04-21 11:57:41.717175+03	\N	0	0	0	normal
898	2	2025-04-21 11:57:41.73336+03	\N	0	0	0	normal
899	2	2025-04-21 11:57:41.748185+03	\N	0	0	0	normal
900	2	2025-04-21 11:57:41.763431+03	\N	0	0	0	normal
901	2	2025-04-21 11:57:41.779081+03	\N	0	0	0	normal
902	2	2025-04-21 11:57:41.795004+03	\N	0	0	0	normal
903	2	2025-04-21 11:57:41.807155+03	\N	0	0	0	normal
904	2	2025-04-21 11:57:41.824543+03	\N	0	0	0	normal
905	2	2025-04-21 11:57:41.841789+03	\N	0	0	0	normal
906	2	2025-04-21 11:57:41.86003+03	\N	0	0	0	normal
907	2	2025-04-21 11:57:41.890935+03	\N	0	0	0	normal
908	2	2025-04-21 11:57:41.906702+03	\N	0	0	0	normal
909	2	2025-04-21 11:57:41.92268+03	\N	0	0	0	normal
910	2	2025-04-21 11:57:41.941224+03	\N	0	0	0	normal
911	2	2025-04-21 11:57:41.956122+03	\N	0	0	0	normal
912	2	2025-04-21 11:57:41.97288+03	\N	0	0	0	normal
913	2	2025-04-21 11:57:41.990058+03	\N	0	0	0	normal
914	2	2025-04-21 11:57:42.00603+03	\N	0	0	0	normal
915	2	2025-04-21 11:57:42.021556+03	\N	0	0	0	normal
916	2	2025-04-21 11:57:42.039736+03	\N	0	0	0	normal
917	2	2025-04-21 11:57:42.054972+03	\N	0	0	0	normal
918	2	2025-04-21 11:57:42.070683+03	\N	0	0	0	normal
919	2	2025-04-21 11:57:42.086722+03	\N	0	0	0	normal
920	2	2025-04-21 11:57:42.104544+03	\N	0	0	0	normal
921	2	2025-04-21 11:57:42.1189+03	\N	0	0	0	normal
922	2	2025-04-21 11:57:42.14597+03	\N	0	0	0	normal
923	2	2025-04-21 11:57:42.168466+03	\N	0	0	0	normal
924	2	2025-04-21 11:57:42.184374+03	\N	0	0	0	normal
925	2	2025-04-21 11:57:42.196872+03	\N	0	0	0	normal
926	2	2025-04-21 11:57:42.214332+03	\N	0	0	0	normal
927	2	2025-04-21 11:57:42.228292+03	\N	0	0	0	normal
928	2	2025-04-21 11:57:42.24285+03	\N	0	0	0	normal
929	2	2025-04-21 11:57:42.259922+03	\N	0	0	0	normal
930	2	2025-04-21 11:57:42.27222+03	\N	0	0	0	normal
931	2	2025-04-21 11:57:42.288631+03	\N	0	0	0	normal
932	2	2025-04-21 11:57:42.321722+03	\N	0	0	0	normal
933	2	2025-04-21 11:57:42.33586+03	\N	0	0	0	normal
934	2	2025-04-21 11:57:42.34831+03	\N	0	0	0	normal
935	2	2025-04-21 11:57:42.362872+03	\N	0	0	0	normal
936	2	2025-04-21 11:57:42.379444+03	\N	0	0	0	normal
937	2	2025-04-21 11:57:42.395856+03	\N	0	0	0	normal
938	2	2025-04-21 11:57:42.413431+03	\N	0	0	0	normal
939	2	2025-04-21 11:57:42.430082+03	\N	0	0	0	normal
940	2	2025-04-21 11:57:42.447361+03	\N	0	0	0	normal
941	2	2025-04-21 11:57:42.463722+03	\N	0	0	0	normal
942	2	2025-04-21 11:57:42.485509+03	\N	0	0	0	normal
943	2	2025-04-21 11:57:42.523087+03	\N	0	0	0	normal
944	2	2025-04-21 11:57:42.541077+03	\N	0	0	0	normal
945	2	2025-04-21 11:57:42.557337+03	\N	0	0	0	normal
946	2	2025-04-21 11:57:42.573083+03	\N	0	0	0	normal
947	2	2025-04-21 11:57:42.588458+03	\N	0	0	0	normal
948	2	2025-04-21 11:57:42.604825+03	\N	0	0	0	normal
949	2	2025-04-21 11:57:42.62111+03	\N	0	0	0	normal
950	2	2025-04-21 11:57:42.636767+03	\N	0	0	0	normal
951	2	2025-04-21 11:57:42.651692+03	\N	0	0	0	normal
952	2	2025-04-21 11:57:42.664031+03	\N	0	0	0	normal
953	2	2025-04-21 11:57:42.678832+03	\N	0	0	0	normal
954	2	2025-04-21 11:57:42.695053+03	\N	0	0	0	normal
955	2	2025-04-21 11:57:42.71205+03	\N	0	0	0	normal
956	2	2025-04-21 11:57:42.728107+03	\N	0	0	0	normal
957	2	2025-04-21 11:57:42.746954+03	\N	0	0	0	normal
958	2	2025-04-21 11:57:42.770202+03	\N	0	0	0	normal
959	2	2025-04-21 11:57:42.805744+03	\N	0	0	0	normal
960	2	2025-04-21 11:57:42.82225+03	\N	0	0	0	normal
961	2	2025-04-21 11:57:42.839644+03	\N	0	0	0	normal
962	2	2025-04-21 11:57:42.854804+03	\N	0	0	0	normal
963	2	2025-04-21 11:57:42.871505+03	\N	0	0	0	normal
964	2	2025-04-21 11:57:42.890868+03	\N	0	0	0	normal
965	2	2025-04-21 11:57:42.912571+03	\N	0	0	0	normal
966	2	2025-04-21 11:57:42.928989+03	\N	0	0	0	normal
967	2	2025-04-21 11:57:42.947151+03	\N	0	0	0	normal
968	2	2025-04-21 11:57:42.96314+03	\N	0	0	0	normal
969	2	2025-04-21 11:57:42.979222+03	\N	0	0	0	normal
970	2	2025-04-21 11:57:42.992723+03	\N	0	0	0	normal
971	2	2025-04-21 11:57:43.007365+03	\N	0	0	0	normal
972	2	2025-04-21 11:57:43.02284+03	\N	0	0	0	normal
973	2	2025-04-21 11:57:43.037802+03	\N	0	0	0	normal
974	2	2025-04-21 11:57:43.05523+03	\N	0	0	0	normal
975	2	2025-04-21 11:57:43.072321+03	\N	0	0	0	normal
976	2	2025-04-21 11:57:43.089983+03	\N	0	0	0	normal
977	2	2025-04-21 11:57:43.105709+03	\N	0	0	0	normal
978	2	2025-04-21 11:57:43.122431+03	\N	0	0	0	normal
979	2	2025-04-21 11:57:43.146299+03	\N	0	0	0	normal
980	2	2025-04-21 11:57:43.16379+03	\N	0	0	0	normal
981	2	2025-04-21 11:57:43.177941+03	\N	0	0	0	normal
982	2	2025-04-21 11:57:43.193496+03	\N	0	0	0	normal
983	2	2025-04-21 11:57:43.207515+03	\N	0	0	0	normal
984	2	2025-04-21 11:57:43.234859+03	\N	0	0	0	normal
985	2	2025-04-21 11:57:43.246941+03	\N	0	0	0	normal
986	2	2025-04-21 11:57:43.275974+03	\N	0	0	0	normal
987	2	2025-04-21 11:57:43.289755+03	\N	0	0	0	normal
988	2	2025-04-21 11:57:43.330962+03	\N	0	0	0	normal
989	2	2025-04-21 11:57:43.346179+03	\N	0	0	0	normal
990	2	2025-04-21 11:57:43.361937+03	\N	0	0	0	normal
991	2	2025-04-21 11:57:43.375746+03	\N	0	0	0	normal
992	2	2025-04-21 11:57:43.390753+03	\N	0	0	0	normal
993	2	2025-04-21 11:57:43.406562+03	\N	0	0	0	normal
994	2	2025-04-21 11:57:43.423833+03	\N	0	0	0	normal
995	2	2025-04-21 11:57:43.438129+03	\N	0	0	0	normal
996	2	2025-04-21 11:57:43.4529+03	\N	0	0	0	normal
997	2	2025-04-21 11:57:43.468366+03	\N	0	0	0	normal
998	2	2025-04-21 11:57:43.479197+03	\N	0	0	0	normal
999	2	2025-04-21 11:57:43.495039+03	\N	0	0	0	normal
1000	2	2025-04-21 11:57:43.508898+03	\N	0	0	0	normal
1001	2	2025-04-21 11:57:43.523501+03	\N	0	0	0	normal
1002	2	2025-04-21 11:57:43.538359+03	\N	0	0	0	normal
1003	2	2025-04-21 11:57:43.553633+03	\N	0	0	0	normal
1004	2	2025-04-21 11:57:43.569612+03	\N	0	0	0	normal
1005	2	2025-04-21 11:57:43.586485+03	\N	0	0	0	normal
1006	2	2025-04-21 11:57:43.604257+03	\N	0	0	0	normal
1007	2	2025-04-21 11:57:43.620975+03	\N	0	0	0	normal
1008	2	2025-04-21 11:57:43.638099+03	\N	0	0	0	normal
1009	2	2025-04-21 11:57:43.672309+03	\N	0	0	0	normal
1010	2	2025-04-21 11:57:43.689309+03	\N	0	0	0	normal
1011	2	2025-04-21 11:57:43.707198+03	\N	0	0	0	normal
1012	2	2025-04-21 11:57:43.724001+03	\N	0	0	0	normal
1013	2	2025-04-21 11:57:43.737475+03	\N	0	0	0	normal
1014	2	2025-04-21 11:57:43.755378+03	\N	0	0	0	normal
1015	2	2025-04-21 11:57:43.77067+03	\N	0	0	0	normal
1016	2	2025-04-21 11:57:43.787441+03	\N	0	0	0	normal
1017	2	2025-04-21 11:57:43.802986+03	\N	0	0	0	normal
1018	2	2025-04-21 11:57:43.813654+03	\N	0	0	0	normal
1019	2	2025-04-21 11:57:43.829243+03	\N	0	0	0	normal
1020	2	2025-04-21 11:57:43.845451+03	\N	0	0	0	normal
1021	2	2025-04-21 11:57:43.876355+03	\N	0	0	0	normal
1022	2	2025-04-21 11:57:43.88751+03	\N	0	0	0	normal
1023	2	2025-04-21 11:57:43.902711+03	\N	0	0	0	normal
1024	2	2025-04-21 11:57:43.918242+03	\N	0	0	0	normal
1025	2	2025-04-21 11:57:43.935688+03	\N	0	0	0	normal
1026	2	2025-04-21 11:57:43.94716+03	\N	0	0	0	normal
1027	2	2025-04-21 11:57:43.962907+03	\N	0	0	0	normal
1028	2	2025-04-21 11:57:43.978856+03	\N	0	0	0	normal
1029	2	2025-04-21 11:57:43.995873+03	\N	0	0	0	normal
1030	2	2025-04-21 11:57:44.012013+03	\N	0	0	0	normal
1031	2	2025-04-21 11:57:44.027877+03	\N	0	0	0	normal
1032	2	2025-04-21 11:57:44.042991+03	\N	0	0	0	normal
1033	2	2025-04-21 11:57:44.05547+03	\N	0	0	0	normal
1034	2	2025-04-21 11:57:44.071283+03	\N	0	0	0	normal
1035	2	2025-04-21 11:57:44.08712+03	\N	0	0	0	normal
1036	2	2025-04-21 11:57:44.105733+03	\N	0	0	0	normal
1037	2	2025-04-21 11:57:44.122349+03	\N	0	0	0	normal
1038	2	2025-04-21 11:57:44.137287+03	\N	0	0	0	normal
1039	2	2025-04-21 11:57:44.154192+03	\N	0	0	0	normal
1040	2	2025-04-21 11:57:44.170948+03	\N	0	0	0	normal
1041	2	2025-04-21 11:57:44.187331+03	\N	0	0	0	normal
1042	2	2025-04-21 11:57:44.202775+03	\N	0	0	0	normal
1043	2	2025-04-21 11:57:44.219822+03	\N	0	0	0	normal
1044	2	2025-04-21 11:57:44.230583+03	\N	0	0	0	normal
1045	2	2025-04-21 11:57:44.245817+03	\N	0	0	0	normal
1046	2	2025-04-21 11:57:44.263032+03	\N	0	0	0	normal
1047	2	2025-04-21 11:57:44.279316+03	\N	0	0	0	normal
1048	2	2025-04-21 11:57:44.295058+03	\N	0	0	0	normal
1049	2	2025-04-21 11:57:44.318338+03	\N	0	0	0	normal
1050	2	2025-04-21 11:57:44.33107+03	\N	0	0	0	normal
1051	2	2025-04-21 11:57:44.346608+03	\N	0	0	0	normal
1052	2	2025-04-21 11:57:44.363264+03	\N	0	0	0	normal
1053	2	2025-04-21 11:57:44.374757+03	\N	0	0	0	normal
1054	2	2025-04-21 11:57:44.389305+03	\N	0	0	0	normal
1055	2	2025-04-21 11:57:44.404894+03	\N	0	0	0	normal
1056	2	2025-04-21 11:57:44.420596+03	\N	0	0	0	normal
1057	2	2025-04-21 11:57:44.43603+03	\N	0	0	0	normal
1058	2	2025-04-21 11:57:44.453347+03	\N	0	0	0	normal
1059	2	2025-04-21 11:57:44.469606+03	\N	0	0	0	normal
1060	2	2025-04-21 11:57:44.488574+03	\N	0	0	0	normal
1061	2	2025-04-21 11:57:44.511306+03	\N	0	0	0	normal
1062	2	2025-04-21 11:57:44.525503+03	\N	0	0	0	normal
1063	2	2025-04-21 11:57:44.539335+03	\N	0	0	0	normal
1064	2	2025-04-21 11:57:44.554243+03	\N	0	0	0	normal
1065	2	2025-04-21 11:57:44.569808+03	\N	0	0	0	normal
1066	2	2025-04-21 11:57:44.587403+03	\N	0	0	0	normal
1067	2	2025-04-21 11:57:44.605637+03	\N	0	0	0	normal
1068	2	2025-04-21 11:57:44.622327+03	\N	0	0	0	normal
1069	2	2025-04-21 11:57:44.640145+03	\N	0	0	0	normal
1070	2	2025-04-21 11:57:44.658943+03	\N	0	0	0	normal
1071	2	2025-04-21 11:57:44.673683+03	\N	0	0	0	normal
1072	2	2025-04-21 11:57:44.689983+03	\N	0	0	0	normal
1073	2	2025-04-21 11:57:44.707595+03	\N	0	0	0	normal
1074	2	2025-04-21 11:57:44.72413+03	\N	0	0	0	normal
1075	2	2025-04-21 11:57:44.978841+03	\N	0	0	0	normal
1076	2	2025-04-21 11:57:44.990937+03	\N	0	0	0	normal
1077	2	2025-04-21 11:57:45.01068+03	\N	0	0	0	normal
1078	2	2025-04-21 11:57:45.029829+03	\N	0	0	0	normal
1079	2	2025-04-21 11:57:45.044655+03	\N	0	0	0	normal
1080	2	2025-04-21 11:57:45.061182+03	\N	0	0	0	normal
1081	2	2025-04-21 11:57:45.076419+03	\N	0	0	0	normal
1082	2	2025-04-21 11:57:45.090624+03	\N	0	0	0	normal
1083	2	2025-04-21 11:57:45.109189+03	\N	0	0	0	normal
1084	2	2025-04-21 11:57:45.125488+03	\N	0	0	0	normal
1085	2	2025-04-21 11:57:45.168201+03	\N	0	0	0	normal
1086	2	2025-04-21 11:57:45.186788+03	\N	0	0	0	normal
1087	2	2025-04-21 11:57:45.201702+03	\N	0	0	0	normal
1088	2	2025-04-21 11:57:45.264225+03	\N	0	0	0	normal
1089	2	2025-04-21 11:57:45.31285+03	\N	0	0	0	normal
1090	2	2025-04-21 11:57:45.3376+03	\N	0	0	0	normal
1091	2	2025-04-21 11:57:45.35497+03	\N	0	0	0	normal
1092	2	2025-04-21 11:57:45.374969+03	\N	0	0	0	normal
1093	2	2025-04-21 11:57:45.395271+03	\N	0	0	0	normal
1094	2	2025-04-21 11:57:45.410341+03	\N	0	0	0	normal
1095	2	2025-04-21 11:57:45.427537+03	\N	0	0	0	normal
1096	2	2025-04-21 11:57:45.445222+03	\N	0	0	0	normal
1097	2	2025-04-21 11:57:45.459611+03	\N	0	0	0	normal
1098	2	2025-04-21 11:57:45.477784+03	\N	0	0	0	normal
1099	2	2025-04-21 11:57:45.503163+03	\N	0	0	0	normal
1100	2	2025-04-21 11:57:45.5219+03	\N	0	0	0	normal
1101	2	2025-04-21 11:57:45.564086+03	\N	0	0	0	normal
1102	2	2025-04-21 11:57:45.927949+03	\N	0	0	0	normal
1103	2	2025-04-21 11:57:45.946232+03	\N	0	0	0	normal
1104	2	2025-04-21 11:57:45.966437+03	\N	0	0	0	normal
1105	2	2025-04-21 11:57:45.997217+03	\N	0	0	0	normal
1106	2	2025-04-21 11:57:46.034422+03	\N	0	0	0	normal
1107	2	2025-04-21 11:57:46.100339+03	\N	0	0	0	normal
1108	2	2025-04-21 11:57:46.121619+03	\N	0	0	0	normal
1109	2	2025-04-21 11:57:46.1385+03	\N	0	0	0	normal
1110	2	2025-04-21 11:57:46.176387+03	\N	0	0	0	normal
1111	2	2025-04-21 11:57:46.196724+03	\N	0	0	0	normal
1112	2	2025-04-21 11:57:46.215474+03	\N	0	0	0	normal
1113	2	2025-04-21 11:57:46.237239+03	\N	0	0	0	normal
1114	2	2025-04-21 11:57:46.262172+03	\N	0	0	0	normal
1115	2	2025-04-21 11:57:46.329698+03	\N	0	0	0	normal
1116	2	2025-04-21 11:57:46.353216+03	\N	0	0	0	normal
1117	2	2025-04-21 11:57:46.371437+03	\N	0	0	0	normal
1118	2	2025-04-21 11:57:46.387956+03	\N	0	0	0	normal
1119	2	2025-04-21 11:57:46.40422+03	\N	0	0	0	normal
1120	2	2025-04-21 11:57:46.420287+03	\N	0	0	0	normal
1121	2	2025-04-21 11:57:46.438962+03	\N	0	0	0	normal
1122	2	2025-04-21 11:57:46.458542+03	\N	0	0	0	normal
1123	2	2025-04-21 11:57:46.491713+03	\N	0	0	0	normal
1124	2	2025-04-21 11:57:46.548763+03	\N	0	0	0	normal
1125	2	2025-04-21 11:57:46.565007+03	\N	0	0	0	normal
1126	2	2025-04-21 11:57:46.594586+03	\N	0	0	0	normal
1127	2	2025-04-21 11:57:46.614422+03	\N	0	0	0	normal
1128	2	2025-04-21 11:57:46.647844+03	\N	0	0	0	normal
1129	2	2025-04-21 11:57:46.674703+03	\N	0	0	0	normal
1130	2	2025-04-21 11:57:46.704775+03	\N	0	0	0	normal
1131	2	2025-04-21 11:57:46.730003+03	\N	0	0	0	normal
1132	2	2025-04-21 11:57:46.755771+03	\N	0	0	0	normal
1133	2	2025-04-21 11:57:46.802986+03	\N	0	0	0	normal
1134	2	2025-04-21 11:57:46.823356+03	\N	0	0	0	normal
1135	2	2025-04-21 11:57:46.846403+03	\N	0	0	0	normal
1136	2	2025-04-21 11:57:46.885096+03	\N	0	0	0	normal
1137	2	2025-04-21 11:57:46.92316+03	\N	0	0	0	normal
1138	2	2025-04-21 11:57:46.959232+03	\N	0	0	0	normal
1139	2	2025-04-21 11:57:47.102869+03	\N	0	0	0	normal
1140	2	2025-04-21 11:57:47.124496+03	\N	0	0	0	normal
1141	2	2025-04-21 11:57:47.159148+03	\N	0	0	0	normal
1142	2	2025-04-21 11:57:47.189168+03	\N	0	0	0	normal
1143	2	2025-04-21 11:57:47.237802+03	\N	0	0	0	normal
1144	2	2025-04-21 11:57:47.284262+03	\N	0	0	0	normal
1145	2	2025-04-21 11:57:47.304138+03	\N	0	0	0	normal
1146	2	2025-04-21 11:57:47.3254+03	\N	0	0	0	normal
1147	2	2025-04-21 11:57:47.36965+03	\N	0	0	0	normal
1148	2	2025-04-21 11:57:47.400456+03	\N	0	0	0	normal
1149	2	2025-04-21 11:57:47.429317+03	\N	0	0	0	normal
1150	2	2025-04-21 11:57:47.452002+03	\N	0	0	0	normal
1151	2	2025-04-21 11:57:47.485369+03	\N	0	0	0	normal
1152	2	2025-04-21 11:57:47.547438+03	\N	0	0	0	normal
1153	2	2025-04-21 11:57:47.571928+03	\N	0	0	0	normal
1154	2	2025-04-21 11:57:47.60151+03	\N	0	0	0	normal
1155	2	2025-04-21 11:57:47.62069+03	\N	0	0	0	normal
1156	2	2025-04-21 11:57:47.640924+03	\N	0	0	0	normal
1157	2	2025-04-21 11:57:47.665839+03	\N	0	0	0	normal
1158	2	2025-04-21 11:57:47.7011+03	\N	0	0	0	normal
1159	2	2025-04-21 11:57:47.719266+03	\N	0	0	0	normal
1160	2	2025-04-21 11:57:47.738137+03	\N	0	0	0	normal
1161	2	2025-04-21 11:57:47.755707+03	\N	0	0	0	normal
1162	2	2025-04-21 11:57:47.775511+03	\N	0	0	0	normal
1163	2	2025-04-21 11:57:47.794934+03	\N	0	0	0	normal
1164	2	2025-04-21 11:57:47.818482+03	\N	0	0	0	normal
1165	2	2025-04-21 11:57:47.841935+03	\N	0	0	0	normal
1166	2	2025-04-21 11:57:47.87094+03	\N	0	0	0	normal
1167	2	2025-04-21 11:57:47.889832+03	\N	0	0	0	normal
1168	2	2025-04-21 11:57:47.909539+03	\N	0	0	0	normal
1169	2	2025-04-21 11:57:47.929598+03	\N	0	0	0	normal
1170	2	2025-04-21 11:57:47.95496+03	\N	0	0	0	normal
1171	2	2025-04-21 11:57:47.987828+03	\N	0	0	0	normal
1172	2	2025-04-21 11:57:48.049802+03	\N	0	0	0	normal
1173	2	2025-04-21 11:57:48.067247+03	\N	0	0	0	normal
1174	2	2025-04-21 11:57:48.097779+03	\N	0	0	0	normal
1175	2	2025-04-21 11:57:48.133631+03	\N	0	0	0	normal
1176	2	2025-04-21 11:57:48.164363+03	\N	0	0	0	normal
1177	2	2025-04-21 11:57:48.188499+03	\N	0	0	0	normal
1178	2	2025-04-21 11:57:48.211447+03	\N	0	0	0	normal
1179	2	2025-04-21 11:57:48.241537+03	\N	0	0	0	normal
1180	2	2025-04-21 11:57:48.352083+03	\N	0	0	0	normal
1181	2	2025-04-21 11:57:48.386008+03	\N	0	0	0	normal
1182	2	2025-04-21 11:57:48.404232+03	\N	0	0	0	normal
1183	2	2025-04-21 11:57:48.423986+03	\N	0	0	0	normal
1184	2	2025-04-21 11:57:48.444759+03	\N	0	0	0	normal
1185	2	2025-04-21 11:57:48.47017+03	\N	0	0	0	normal
1186	2	2025-04-21 11:57:48.49324+03	\N	0	0	0	normal
1187	2	2025-04-21 11:57:48.534319+03	\N	0	0	0	normal
1188	2	2025-04-21 11:57:48.556281+03	\N	0	0	0	normal
1189	2	2025-04-21 11:57:48.583976+03	\N	0	0	0	normal
1190	2	2025-04-21 11:57:48.604309+03	\N	0	0	0	normal
1191	2	2025-04-21 11:57:48.628554+03	\N	0	0	0	normal
1192	2	2025-04-21 11:57:48.656103+03	\N	0	0	0	normal
1193	2	2025-04-21 11:57:48.683884+03	\N	0	0	0	normal
1194	2	2025-04-21 11:57:48.717147+03	\N	0	0	0	normal
1195	2	2025-04-21 11:57:48.812845+03	\N	0	0	0	normal
1196	2	2025-04-21 11:57:48.860469+03	\N	0	0	0	normal
1197	2	2025-04-21 11:57:48.886268+03	\N	0	0	0	normal
1198	2	2025-04-21 11:57:48.905921+03	\N	0	0	0	normal
1199	2	2025-04-21 11:57:48.925774+03	\N	0	0	0	normal
1200	2	2025-04-21 11:57:48.944796+03	\N	0	0	0	normal
1201	2	2025-04-21 11:57:48.962531+03	\N	0	0	0	normal
1202	2	2025-04-21 11:57:48.985549+03	\N	0	0	0	normal
1203	2	2025-04-21 11:57:49.008091+03	\N	0	0	0	normal
1204	2	2025-04-21 11:57:49.038573+03	\N	0	0	0	normal
1205	2	2025-04-21 11:57:49.069962+03	\N	0	0	0	normal
1206	2	2025-04-21 11:57:49.093779+03	\N	0	0	0	normal
1207	2	2025-04-21 11:57:49.230986+03	\N	0	0	0	normal
1208	2	2025-04-21 11:57:49.280291+03	\N	0	0	0	normal
1209	2	2025-04-21 11:57:49.304488+03	\N	0	0	0	normal
1210	2	2025-04-21 11:57:49.33337+03	\N	0	0	0	normal
1211	2	2025-04-21 11:57:49.408132+03	\N	0	0	0	normal
1212	2	2025-04-21 11:57:49.469372+03	\N	0	0	0	normal
1213	2	2025-04-21 11:57:49.490482+03	\N	0	0	0	normal
1214	2	2025-04-21 11:57:49.511237+03	\N	0	0	0	normal
1215	2	2025-04-21 11:57:49.53098+03	\N	0	0	0	normal
1216	2	2025-04-21 11:57:49.555259+03	\N	0	0	0	normal
1217	2	2025-04-21 11:57:49.583265+03	\N	0	0	0	normal
1218	2	2025-04-21 11:57:49.614672+03	\N	0	0	0	normal
1219	2	2025-04-21 11:57:49.657363+03	\N	0	0	0	normal
1220	2	2025-04-21 11:57:49.725972+03	\N	0	0	0	normal
1221	2	2025-04-21 11:57:49.750731+03	\N	0	0	0	normal
1222	2	2025-04-21 11:57:49.780892+03	\N	0	0	0	normal
1223	2	2025-04-21 11:57:49.814257+03	\N	0	0	0	normal
1224	2	2025-04-21 11:57:49.836264+03	\N	0	0	0	normal
1225	2	2025-04-21 11:57:49.875887+03	\N	0	0	0	normal
1226	2	2025-04-21 11:57:49.94357+03	\N	0	0	0	normal
1227	2	2025-04-21 11:57:49.970511+03	\N	0	0	0	normal
1228	2	2025-04-21 11:57:49.996141+03	\N	0	0	0	normal
1229	2	2025-04-21 11:57:50.045587+03	\N	0	0	0	normal
1230	2	2025-04-21 11:57:50.096139+03	\N	0	0	0	normal
1231	2	2025-04-21 11:57:50.14039+03	\N	0	0	0	normal
1232	2	2025-04-21 11:57:50.163898+03	\N	0	0	0	normal
1233	2	2025-04-21 11:57:50.19234+03	\N	0	0	0	normal
1234	2	2025-04-21 11:57:50.211362+03	\N	0	0	0	normal
1235	2	2025-04-21 11:57:50.229177+03	\N	0	0	0	normal
1236	2	2025-04-21 11:57:50.258989+03	\N	0	0	0	normal
1237	2	2025-04-21 11:57:50.293366+03	\N	0	0	0	normal
1238	2	2025-04-21 11:57:50.335475+03	\N	0	0	0	normal
1239	2	2025-04-21 11:57:50.357769+03	\N	0	0	0	normal
1240	2	2025-04-21 11:57:50.387116+03	\N	0	0	0	normal
1241	2	2025-04-21 11:57:50.405611+03	\N	0	0	0	normal
1242	2	2025-04-21 11:57:50.433032+03	\N	0	0	0	normal
1243	2	2025-04-21 11:57:50.448593+03	\N	0	0	0	normal
1244	2	2025-04-21 11:57:50.470396+03	\N	0	0	0	normal
1245	2	2025-04-21 11:57:50.498474+03	\N	0	0	0	normal
1246	2	2025-04-21 11:57:50.531117+03	\N	0	0	0	normal
1247	2	2025-04-21 11:57:50.551496+03	\N	0	0	0	normal
1248	2	2025-04-21 11:57:50.570976+03	\N	0	0	0	normal
1249	2	2025-04-21 11:57:50.592622+03	\N	0	0	0	normal
1250	2	2025-04-21 11:57:50.61386+03	\N	0	0	0	normal
1251	2	2025-04-21 11:57:50.635016+03	\N	0	0	0	normal
1252	2	2025-04-21 11:57:50.654979+03	\N	0	0	0	normal
1253	2	2025-04-21 11:57:50.676723+03	\N	0	0	0	normal
1254	2	2025-04-21 11:57:50.696849+03	\N	0	0	0	normal
1255	2	2025-04-21 11:57:50.719391+03	\N	0	0	0	normal
1256	2	2025-04-21 11:57:50.739574+03	\N	0	0	0	normal
1257	2	2025-04-21 11:57:50.769901+03	\N	0	0	0	normal
1258	2	2025-04-21 11:57:50.809407+03	\N	0	0	0	normal
1259	2	2025-04-21 11:57:50.838852+03	\N	0	0	0	normal
1260	2	2025-04-21 11:57:50.860912+03	\N	0	0	0	normal
1261	2	2025-04-21 11:57:50.8806+03	\N	0	0	0	normal
1262	2	2025-04-21 11:57:50.90371+03	\N	0	0	0	normal
1263	2	2025-04-21 11:57:50.923611+03	\N	0	0	0	normal
1273	2	2025-04-21 11:58:26.25491+03	\N	0	0	0	normal
1274	2	2025-04-21 11:58:26.27339+03	\N	0	0	0	normal
1275	2	2025-04-21 11:58:26.294499+03	\N	0	0	0	normal
1276	2	2025-04-21 11:58:26.325028+03	\N	0	0	0	normal
1277	2	2025-04-21 11:58:26.355985+03	\N	0	0	0	normal
1278	2	2025-04-21 11:58:26.396743+03	\N	0	0	0	normal
1279	2	2025-04-21 11:58:26.446906+03	\N	0	0	0	normal
1280	2	2025-04-21 11:58:26.464142+03	\N	0	0	0	normal
1281	2	2025-04-21 11:58:26.488848+03	\N	0	0	0	normal
1282	2	2025-04-21 11:58:26.610998+03	\N	0	0	0	normal
1283	2	2025-04-21 11:58:26.637555+03	\N	0	0	0	normal
1284	2	2025-04-21 11:58:26.658761+03	\N	0	0	0	normal
1285	2	2025-04-21 11:58:26.726003+03	\N	0	0	0	normal
1286	2	2025-04-21 11:58:26.747+03	\N	0	0	0	normal
1287	2	2025-04-21 11:58:26.774297+03	\N	0	0	0	normal
1288	2	2025-04-21 11:58:26.813195+03	\N	0	0	0	normal
1289	2	2025-04-21 11:58:26.835988+03	\N	0	0	0	normal
1290	2	2025-04-21 11:58:26.859736+03	\N	0	0	0	normal
1291	2	2025-04-21 11:58:26.887522+03	\N	0	0	0	normal
1292	2	2025-04-21 11:58:26.913996+03	\N	0	0	0	normal
1293	2	2025-04-21 11:58:26.936167+03	\N	0	0	0	normal
1294	2	2025-04-21 11:58:26.963655+03	\N	0	0	0	normal
1295	2	2025-04-21 11:58:27.014492+03	\N	0	0	0	normal
1296	2	2025-04-21 11:58:27.047308+03	\N	0	0	0	normal
1297	2	2025-04-21 11:58:27.080981+03	\N	0	0	0	normal
1298	2	2025-04-21 11:58:27.11264+03	\N	0	0	0	normal
1299	2	2025-04-21 11:58:27.165058+03	\N	0	0	0	normal
1300	2	2025-04-21 11:58:27.188573+03	\N	0	0	0	normal
1301	2	2025-04-21 11:58:27.214888+03	\N	0	0	0	normal
1302	2	2025-04-21 11:58:28.997808+03	\N	0	0	0	normal
1303	2	2025-04-21 11:58:29.046305+03	\N	0	0	0	normal
1304	2	2025-04-21 11:58:29.06427+03	\N	0	0	0	normal
1305	2	2025-04-21 11:58:29.086084+03	\N	0	0	0	normal
1306	2	2025-04-21 11:58:29.106617+03	\N	0	0	0	normal
1307	2	2025-04-21 11:58:29.128401+03	\N	0	0	0	normal
1308	2	2025-04-21 11:58:29.188936+03	\N	0	0	0	normal
1309	2	2025-04-21 11:58:29.23444+03	\N	0	0	0	normal
1310	2	2025-04-21 11:58:29.304841+03	\N	0	0	0	normal
1311	2	2025-04-21 11:58:29.32854+03	\N	0	0	0	normal
1312	2	2025-04-21 11:58:29.35271+03	\N	0	0	0	normal
1313	2	2025-04-21 11:58:29.378577+03	\N	0	0	0	normal
1314	2	2025-04-21 11:58:29.397995+03	\N	0	0	0	normal
1315	2	2025-04-21 11:58:29.423289+03	\N	0	0	0	normal
1316	2	2025-04-21 11:58:29.445087+03	\N	0	0	0	normal
1317	2	2025-04-21 11:58:29.463183+03	\N	0	0	0	normal
1318	2	2025-04-21 11:58:29.480539+03	\N	0	0	0	normal
1319	2	2025-04-21 11:58:29.501792+03	\N	0	0	0	normal
1320	2	2025-04-21 11:58:29.528742+03	\N	0	0	0	normal
1321	2	2025-04-21 11:58:29.547011+03	\N	0	0	0	normal
1322	2	2025-04-21 11:58:29.56862+03	\N	0	0	0	normal
1323	2	2025-04-21 11:58:29.590294+03	\N	0	0	0	normal
1324	2	2025-04-21 11:58:29.618682+03	\N	0	0	0	normal
1325	2	2025-04-21 11:58:29.639169+03	\N	0	0	0	normal
1326	2	2025-04-21 11:58:29.672004+03	\N	0	0	0	normal
1327	2	2025-04-21 11:58:29.7381+03	\N	0	0	0	normal
1328	2	2025-04-21 11:58:29.762533+03	\N	0	0	0	normal
1329	2	2025-04-21 11:58:29.795619+03	\N	0	0	0	normal
1330	2	2025-04-21 11:58:29.826686+03	\N	0	0	0	normal
1331	2	2025-04-21 11:58:29.864676+03	\N	0	0	0	normal
1332	2	2025-04-21 11:58:29.914381+03	\N	0	0	0	normal
1333	2	2025-04-21 11:58:29.937731+03	\N	0	0	0	normal
1334	2	2025-04-21 11:58:29.96173+03	\N	0	0	0	normal
1335	2	2025-04-21 11:58:29.985548+03	\N	0	0	0	normal
1336	2	2025-04-21 11:58:30.003874+03	\N	0	0	0	normal
1337	2	2025-04-21 11:58:30.029702+03	\N	0	0	0	normal
1338	2	2025-04-21 11:58:30.054644+03	\N	0	0	0	normal
1339	2	2025-04-21 11:58:30.075384+03	\N	0	0	0	normal
1340	2	2025-04-21 11:58:30.097742+03	\N	0	0	0	normal
1341	2	2025-04-21 11:58:30.121487+03	\N	0	0	0	normal
1342	2	2025-04-21 11:58:30.143733+03	\N	0	0	0	normal
1343	2	2025-04-21 11:58:30.161771+03	\N	0	0	0	normal
1344	2	2025-04-21 11:58:30.183458+03	\N	0	0	0	normal
1345	2	2025-04-21 11:58:30.207457+03	\N	0	0	0	normal
1346	2	2025-04-21 11:58:30.228379+03	\N	0	0	0	normal
1347	2	2025-04-21 11:58:30.257603+03	\N	0	0	0	normal
1348	2	2025-04-21 11:58:30.279348+03	\N	0	0	0	normal
1349	2	2025-04-21 11:58:30.313161+03	\N	0	0	0	normal
1350	2	2025-04-21 11:58:30.349931+03	\N	0	0	0	normal
1351	2	2025-04-21 11:58:30.373722+03	\N	0	0	0	normal
1352	2	2025-04-21 11:58:38.710007+03	\N	0	0	0	normal
1353	2	2025-04-21 11:58:38.805785+03	\N	0	0	0	normal
1354	2	2025-04-21 11:58:38.831756+03	\N	0	0	0	normal
1355	2	2025-04-21 11:58:38.863556+03	\N	0	0	0	normal
1356	2	2025-04-21 11:58:38.892014+03	\N	0	0	0	normal
1357	2	2025-04-21 11:58:38.915474+03	\N	0	0	0	normal
1358	2	2025-04-21 11:58:38.948144+03	\N	0	0	0	normal
1359	2	2025-04-21 11:58:38.993526+03	\N	0	0	0	normal
1360	2	2025-04-21 11:58:39.012526+03	\N	0	0	0	normal
1361	2	2025-04-21 11:58:39.036556+03	\N	0	0	0	normal
1362	2	2025-04-21 11:58:39.055082+03	\N	0	0	0	normal
1363	2	2025-04-21 11:58:39.070589+03	\N	0	0	0	normal
1364	2	2025-04-21 11:58:39.087929+03	\N	0	0	0	normal
1365	2	2025-04-21 11:58:39.111157+03	\N	0	0	0	normal
1366	2	2025-04-21 11:58:39.128871+03	\N	0	0	0	normal
1367	2	2025-04-21 11:58:39.164835+03	\N	0	0	0	normal
1368	2	2025-04-21 11:58:39.183478+03	\N	0	0	0	normal
1369	2	2025-04-21 11:58:39.203+03	\N	0	0	0	normal
1370	2	2025-04-21 11:58:39.223166+03	\N	0	0	0	normal
1371	2	2025-04-21 11:58:39.264494+03	\N	0	0	0	normal
1372	2	2025-04-21 11:58:39.293254+03	\N	0	0	0	normal
1373	2	2025-04-21 11:58:39.31247+03	\N	0	0	0	normal
1374	2	2025-04-21 11:58:39.33518+03	\N	0	0	0	normal
1375	2	2025-04-21 11:58:39.357245+03	\N	0	0	0	normal
1376	2	2025-04-21 11:58:39.380403+03	\N	0	0	0	normal
1377	2	2025-04-21 11:58:39.403783+03	\N	0	0	0	normal
1378	2	2025-04-21 11:58:39.424689+03	\N	0	0	0	normal
1379	2	2025-04-21 11:58:39.447189+03	\N	0	0	0	normal
1380	2	2025-04-21 11:58:39.485837+03	\N	0	0	0	normal
1381	2	2025-04-21 11:58:39.514568+03	\N	0	0	0	normal
1382	2	2025-04-21 11:58:39.540936+03	\N	0	0	0	normal
1383	2	2025-04-21 11:58:39.580135+03	\N	0	0	0	normal
1384	2	2025-04-21 11:58:39.61094+03	\N	0	0	0	normal
1385	2	2025-04-21 11:58:39.641451+03	\N	0	0	0	normal
1386	2	2025-04-21 11:58:39.711042+03	\N	0	0	0	normal
1387	2	2025-04-21 11:58:39.734998+03	\N	0	0	0	normal
1388	2	2025-04-21 11:58:39.762164+03	\N	0	0	0	normal
1389	2	2025-04-21 11:58:39.793396+03	\N	0	0	0	normal
1390	2	2025-04-21 11:58:39.824553+03	\N	0	0	0	normal
1391	2	2025-04-21 11:58:39.848585+03	\N	0	0	0	normal
1392	2	2025-04-21 11:58:39.881125+03	\N	0	0	0	normal
1393	2	2025-04-21 11:58:39.922155+03	\N	0	0	0	normal
1394	2	2025-04-21 11:58:39.950792+03	\N	0	0	0	normal
1395	2	2025-04-21 11:58:39.977509+03	\N	0	0	0	normal
1396	2	2025-04-21 11:58:40.00618+03	\N	0	0	0	normal
1397	2	2025-04-21 11:58:40.038225+03	\N	0	0	0	normal
1398	2	2025-04-21 11:58:40.064332+03	\N	0	0	0	normal
1399	2	2025-04-21 11:58:40.088608+03	\N	0	0	0	normal
1400	2	2025-04-21 11:58:40.121732+03	\N	0	0	0	normal
1401	2	2025-04-21 11:58:40.147924+03	\N	0	0	0	normal
1402	2	2025-04-21 11:58:40.175462+03	\N	0	0	0	normal
1403	2	2025-04-21 11:58:40.19471+03	\N	0	0	0	normal
1404	2	2025-04-21 11:58:40.224781+03	\N	0	0	0	normal
1405	2	2025-04-21 11:58:40.249714+03	\N	0	0	0	normal
1406	2	2025-04-21 11:58:40.272436+03	\N	0	0	0	normal
1407	2	2025-04-21 11:58:40.303974+03	\N	0	0	0	normal
1408	2	2025-04-21 11:58:40.339397+03	\N	0	0	0	normal
1409	2	2025-04-21 11:58:40.362338+03	\N	0	0	0	normal
1410	2	2025-04-21 11:58:54.77707+03	\N	0	0	0	normal
1411	2	2025-04-21 11:58:54.821317+03	\N	0	0	0	normal
1412	2	2025-04-21 11:58:54.843963+03	\N	0	0	0	normal
1413	2	2025-04-21 11:58:54.866487+03	\N	0	0	0	normal
1414	2	2025-04-21 11:58:54.91244+03	\N	0	0	0	normal
1415	2	2025-04-21 11:58:54.940862+03	\N	0	0	0	normal
1416	2	2025-04-21 11:58:54.980805+03	\N	0	0	0	normal
1417	2	2025-04-21 11:58:55.009142+03	\N	0	0	0	normal
1418	2	2025-04-21 11:58:55.043028+03	\N	0	0	0	normal
1419	2	2025-04-21 11:58:55.069618+03	\N	0	0	0	normal
1420	2	2025-04-21 11:58:55.090828+03	\N	0	0	0	normal
1421	2	2025-04-21 11:58:55.144499+03	\N	0	0	0	normal
1422	2	2025-04-21 11:58:55.229897+03	\N	0	0	0	normal
1423	2	2025-04-21 11:58:55.264211+03	\N	0	0	0	normal
1424	2	2025-04-21 11:58:55.290465+03	\N	0	0	0	normal
1425	2	2025-04-21 11:58:55.312807+03	\N	0	0	0	normal
1426	2	2025-04-21 11:58:55.336476+03	\N	0	0	0	normal
1427	2	2025-04-21 11:58:55.369358+03	\N	0	0	0	normal
1428	2	2025-04-21 11:58:55.406661+03	\N	0	0	0	normal
1429	2	2025-04-21 11:58:55.434813+03	\N	0	0	0	normal
1430	2	2025-04-21 11:58:55.470121+03	\N	0	0	0	normal
1431	2	2025-04-21 11:58:55.496022+03	\N	0	0	0	normal
1432	2	2025-04-21 11:58:55.520509+03	\N	0	0	0	normal
1433	2	2025-04-21 11:58:55.545819+03	\N	0	0	0	normal
1434	2	2025-04-21 11:58:55.579089+03	\N	0	0	0	normal
1435	2	2025-04-21 11:58:55.60586+03	\N	0	0	0	normal
1436	2	2025-04-21 11:58:55.825261+03	\N	0	0	0	normal
1437	2	2025-04-21 11:58:55.931148+03	\N	0	0	0	normal
1438	2	2025-04-21 11:58:55.950034+03	\N	0	0	0	normal
1439	2	2025-04-21 11:58:55.967578+03	\N	0	0	0	normal
1440	2	2025-04-21 11:59:03.005192+03	\N	0	0	0	normal
1441	2	2025-04-21 11:59:03.041672+03	\N	0	0	0	normal
1442	2	2025-04-21 11:59:03.069149+03	\N	0	0	0	normal
1443	2	2025-04-21 11:59:03.112283+03	\N	0	0	0	normal
1444	2	2025-04-21 11:59:03.136762+03	\N	0	0	0	normal
1445	2	2025-04-21 11:59:03.194013+03	\N	0	0	0	normal
1446	2	2025-04-21 11:59:03.226378+03	\N	0	0	0	normal
1447	2	2025-04-21 11:59:03.271556+03	\N	0	0	0	normal
1448	2	2025-04-21 11:59:03.300765+03	\N	0	0	0	normal
1449	2	2025-04-21 11:59:03.32862+03	\N	0	0	0	normal
1450	2	2025-04-21 11:59:03.363369+03	\N	0	0	0	normal
1451	2	2025-04-21 11:59:03.413299+03	\N	0	0	0	normal
1452	2	2025-04-21 11:59:03.442181+03	\N	0	0	0	normal
1453	2	2025-04-21 11:59:03.496128+03	\N	0	0	0	normal
1454	2	2025-04-21 11:59:03.52026+03	\N	0	0	0	normal
1455	2	2025-04-21 11:59:03.540307+03	\N	0	0	0	normal
1456	2	2025-04-21 11:59:03.561085+03	\N	0	0	0	normal
1457	2	2025-04-21 11:59:03.579461+03	\N	0	0	0	normal
1458	2	2025-04-21 11:59:03.608064+03	\N	0	0	0	normal
1459	2	2025-04-21 11:59:03.635714+03	\N	0	0	0	normal
1460	2	2025-04-21 11:59:03.679979+03	\N	0	0	0	normal
1461	2	2025-04-21 11:59:03.726961+03	\N	0	0	0	normal
1462	2	2025-04-21 11:59:03.746641+03	\N	0	0	0	normal
1463	2	2025-04-21 11:59:03.792307+03	\N	0	0	0	normal
1464	2	2025-04-21 11:59:03.829832+03	\N	0	0	0	normal
1465	2	2025-04-21 11:59:03.869616+03	\N	0	0	0	normal
1466	2	2025-04-21 11:59:03.92037+03	\N	0	0	0	normal
1467	2	2025-04-21 11:59:03.945117+03	\N	0	0	0	normal
1468	2	2025-04-21 11:59:03.96904+03	\N	0	0	0	normal
1469	2	2025-04-21 11:59:03.99299+03	\N	0	0	0	normal
1470	2	2025-04-21 11:59:04.019891+03	\N	0	0	0	normal
1471	2	2025-04-21 11:59:04.046228+03	\N	0	0	0	normal
1472	2	2025-04-21 11:59:04.06913+03	\N	0	0	0	normal
1473	2	2025-04-21 11:59:04.09438+03	\N	0	0	0	normal
1474	2	2025-04-21 11:59:04.11384+03	\N	0	0	0	normal
1475	2	2025-04-21 11:59:04.144261+03	\N	0	0	0	normal
1476	2	2025-04-21 11:59:04.185151+03	\N	0	0	0	normal
1477	2	2025-04-21 11:59:47.794037+03	\N	0	0	0	normal
1478	2	2025-04-21 12:01:28.775052+03	\N	0	0	0	normal
1479	2	2025-04-21 12:01:37.168339+03	\N	0	0	0	normal
1480	2	2025-04-21 12:01:40.316067+03	\N	0	0	0	normal
1481	2	2025-04-21 12:01:44.003403+03	2025-04-21 12:03:24.751639+03	5	5	100	normal
1482	2	2025-04-21 12:03:35.271386+03	\N	0	0	0	normal
1483	2	2025-04-21 12:07:59.895935+03	\N	0	0	0	normal
1484	2	2025-04-21 12:11:21.401238+03	\N	0	0	0	normal
1485	2	2025-04-21 12:11:48.430229+03	\N	0	0	0	normal
1486	2	2025-04-21 12:11:52.789022+03	\N	0	0	0	normal
1487	2	2025-04-21 12:12:00.129867+03	\N	2	2	42	normal
1488	2	2025-04-21 12:12:21.210277+03	\N	0	0	0	normal
1489	2	2025-04-21 12:12:28.977385+03	\N	0	0	0	normal
1490	2	2025-04-21 12:12:34.276843+03	\N	0	0	0	normal
1491	2	2025-04-21 12:13:21.144277+03	\N	0	0	0	normal
1492	2	2025-04-21 12:13:27.551486+03	\N	0	0	0	normal
1493	2	2025-04-21 12:13:31.515904+03	\N	0	0	0	normal
1494	2	2025-04-21 12:13:34.682242+03	\N	0	0	0	normal
1495	2	2025-04-21 12:13:39.035942+03	\N	0	0	0	normal
1496	2	2025-04-21 12:13:41.961042+03	\N	0	0	0	normal
1497	3	2025-04-21 12:14:09.900494+03	2025-04-21 12:14:34.025312+03	5	5	50	normal
1498	3	2025-04-21 12:14:39.277001+03	\N	0	0	0	normal
1499	3	2025-04-21 12:23:09.487568+03	\N	0	0	0	normal
1500	3	2025-04-21 12:23:11.835344+03	\N	0	0	0	normal
1501	3	2025-04-21 12:23:18.968545+03	\N	0	0	0	normal
1502	3	2025-04-21 12:23:25.009183+03	\N	0	0	0	normal
1503	3	2025-04-21 12:23:28.625846+03	\N	0	0	0	normal
1504	3	2025-04-21 12:23:32.249351+03	\N	0	0	0	normal
1505	3	2025-04-21 12:23:37.152504+03	\N	0	0	0	normal
1506	3	2025-04-21 12:23:41.051849+03	\N	0	0	0	normal
1507	3	2025-04-21 12:23:44.526398+03	\N	0	0	0	normal
1508	3	2025-04-21 12:23:49.271906+03	\N	0	0	0	normal
1509	3	2025-04-21 12:23:49.316281+03	\N	0	0	0	normal
1510	3	2025-04-21 12:23:49.332656+03	\N	0	0	0	normal
1511	3	2025-04-21 12:23:49.346305+03	\N	0	0	0	normal
1512	3	2025-04-21 12:23:49.361995+03	\N	0	0	0	normal
1513	3	2025-04-21 12:23:49.376572+03	\N	0	0	0	normal
1514	3	2025-04-21 12:23:49.387485+03	\N	0	0	0	normal
1515	3	2025-04-21 12:23:49.402424+03	\N	0	0	0	normal
1516	3	2025-04-21 12:23:49.416166+03	\N	0	0	0	normal
1517	3	2025-04-21 12:23:49.430401+03	\N	0	0	0	normal
1518	3	2025-04-21 12:23:49.444937+03	\N	0	0	0	normal
1519	3	2025-04-21 12:23:49.460632+03	\N	0	0	0	normal
1520	3	2025-04-21 12:23:49.479905+03	\N	0	0	0	normal
1521	3	2025-04-21 12:23:49.494246+03	\N	0	0	0	normal
1522	3	2025-04-21 12:23:49.505307+03	\N	0	0	0	normal
1523	3	2025-04-21 12:23:49.520522+03	\N	0	0	0	normal
1524	3	2025-04-21 12:23:49.534478+03	\N	0	0	0	normal
1525	3	2025-04-21 12:23:49.551898+03	\N	0	0	0	normal
1526	3	2025-04-21 12:23:49.577925+03	\N	0	0	0	normal
1527	3	2025-04-21 12:23:49.603434+03	\N	0	0	0	normal
1528	3	2025-04-21 12:23:49.621996+03	\N	0	0	0	normal
1529	3	2025-04-21 12:23:49.646029+03	\N	0	0	0	normal
1530	3	2025-04-21 12:23:49.661339+03	\N	0	0	0	normal
1531	3	2025-04-21 12:23:49.677773+03	\N	0	0	0	normal
1532	3	2025-04-21 12:23:49.693681+03	\N	0	0	0	normal
1533	3	2025-04-21 12:23:49.709466+03	\N	0	0	0	normal
1534	3	2025-04-21 12:23:49.725941+03	\N	0	0	0	normal
1535	3	2025-04-21 12:23:49.742298+03	\N	0	0	0	normal
1536	3	2025-04-21 12:23:49.762453+03	\N	0	0	0	normal
1537	3	2025-04-21 12:23:49.780491+03	\N	0	0	0	normal
1538	3	2025-04-21 12:23:49.796413+03	\N	0	0	0	normal
1539	3	2025-04-21 12:23:49.812649+03	\N	0	0	0	normal
1540	3	2025-04-21 12:23:49.828227+03	\N	0	0	0	normal
1541	3	2025-04-21 12:23:49.843901+03	\N	0	0	0	normal
1542	3	2025-04-21 12:23:49.860978+03	\N	0	0	0	normal
1543	3	2025-04-21 12:23:49.877708+03	\N	0	0	0	normal
1544	3	2025-04-21 12:23:49.895101+03	\N	0	0	0	normal
1545	3	2025-04-21 12:23:49.913192+03	\N	0	0	0	normal
1546	3	2025-04-21 12:23:49.929122+03	\N	0	0	0	normal
1547	3	2025-04-21 12:23:49.945667+03	\N	0	0	0	normal
1548	3	2025-04-21 12:23:49.963205+03	\N	0	0	0	normal
1549	3	2025-04-21 12:23:49.981902+03	\N	0	0	0	normal
1550	3	2025-04-21 12:23:49.996863+03	\N	0	0	0	normal
1551	3	2025-04-21 12:23:50.015432+03	\N	0	0	0	normal
1552	3	2025-04-21 12:23:50.036231+03	\N	0	0	0	normal
1553	3	2025-04-21 12:23:50.05357+03	\N	0	0	0	normal
1554	3	2025-04-21 12:23:50.076058+03	\N	0	0	0	normal
1555	3	2025-04-21 12:23:50.091334+03	\N	0	0	0	normal
1556	3	2025-04-21 12:23:50.1078+03	\N	0	0	0	normal
1557	3	2025-04-21 12:23:50.127993+03	\N	0	0	0	normal
1558	3	2025-04-21 12:23:50.14621+03	\N	0	0	0	normal
1559	3	2025-04-21 12:23:50.161445+03	\N	0	0	0	normal
1560	3	2025-04-21 12:23:50.179964+03	\N	0	0	0	normal
1561	3	2025-04-21 12:23:50.211933+03	\N	0	0	0	normal
1562	3	2025-04-21 12:23:50.233247+03	\N	0	0	0	normal
1563	3	2025-04-21 12:23:50.247412+03	\N	0	0	0	normal
1564	3	2025-04-21 12:23:50.266699+03	\N	0	0	0	normal
1565	3	2025-04-21 12:23:50.287522+03	\N	0	0	0	normal
1566	3	2025-04-21 12:23:50.308831+03	\N	0	0	0	normal
1567	3	2025-04-21 12:23:50.327934+03	\N	0	0	0	normal
1568	3	2025-04-21 12:23:50.346645+03	\N	0	0	0	normal
1569	3	2025-04-21 12:23:50.364105+03	\N	0	0	0	normal
1570	3	2025-04-21 12:23:50.387186+03	\N	0	0	0	normal
1571	3	2025-04-21 12:23:50.431652+03	\N	0	0	0	normal
1572	3	2025-04-21 12:23:50.447749+03	\N	0	0	0	normal
1573	3	2025-04-21 12:23:50.463729+03	\N	0	0	0	normal
1574	3	2025-04-21 12:23:50.481724+03	\N	0	0	0	normal
1575	3	2025-04-21 12:23:50.499469+03	\N	0	0	0	normal
1576	3	2025-04-21 12:23:50.514388+03	\N	0	0	0	normal
1577	3	2025-04-21 12:23:50.531277+03	\N	0	0	0	normal
1578	3	2025-04-21 12:23:50.547721+03	\N	0	0	0	normal
1579	3	2025-04-21 12:23:50.563802+03	\N	0	0	0	normal
1580	3	2025-04-21 12:23:50.580709+03	\N	0	0	0	normal
1581	3	2025-04-21 12:23:50.59565+03	\N	0	0	0	normal
1582	3	2025-04-21 12:23:50.617134+03	\N	0	0	0	normal
1583	3	2025-04-21 12:23:50.63195+03	\N	0	0	0	normal
1584	3	2025-04-21 12:23:50.650696+03	\N	0	0	0	normal
1585	3	2025-04-21 12:23:50.668455+03	\N	0	0	0	normal
1586	3	2025-04-21 12:23:53.504057+03	\N	0	0	0	normal
1587	3	2025-04-21 12:23:59.765142+03	\N	0	0	0	normal
1631	5	2025-04-26 10:33:47.126805+03	\N	1	1	15	normal
1632	5	2025-04-26 10:36:49.876163+03	\N	0	0	0	normal
1604	4	2025-04-22 10:31:43.437058+03	2025-04-22 10:32:31.79754+03	5	4	0	normal
1605	4	2025-04-22 10:32:47.129911+03	\N	2	2	0	normal
1606	4	2025-04-22 10:33:12.114467+03	\N	0	0	0	normal
1588	3	2025-04-21 12:24:02.868551+03	\N	9	9	90	normal
1589	3	2025-04-21 12:25:18.965729+03	\N	0	0	0	normal
1590	3	2025-04-21 12:25:30.517591+03	\N	0	0	0	normal
1591	3	2025-04-21 12:28:56.598442+03	\N	0	0	0	normal
1592	3	2025-04-21 12:28:59.870194+03	\N	0	0	0	normal
1593	3	2025-04-21 12:29:02.886802+03	\N	0	0	0	normal
1594	3	2025-04-21 12:29:05.879905+03	\N	1	1	10	normal
1633	5	2025-04-26 10:37:23.668981+03	\N	1	1	22	normal
1652	4	2025-04-26 18:13:33.984549+03	\N	3	3	60	normal
1634	5	2025-04-26 10:40:09.559516+03	\N	2	2	47	normal
1635	5	2025-04-26 10:42:00.463563+03	\N	0	0	0	normal
1595	3	2025-04-21 12:29:16.994978+03	2025-04-21 12:29:41.973824+03	5	5	88	normal
1596	3	2025-04-21 12:29:47.728684+03	\N	0	0	0	normal
1597	3	2025-04-21 12:29:49.878988+03	\N	0	0	0	normal
1607	4	2025-04-22 13:42:00.043415+03	2025-04-22 13:42:44.741389+03	5	4	60	normal
1608	4	2025-04-22 13:42:53.873993+03	\N	0	0	0	normal
1609	4	2025-04-22 13:43:00.452879+03	\N	0	0	0	normal
1610	4	2025-04-22 13:43:10.780135+03	\N	0	0	0	normal
1611	4	2025-04-22 13:43:30.547406+03	\N	0	0	0	normal
1598	4	2025-04-21 12:33:44.009495+03	2025-04-21 12:34:05.152709+03	5	5	50	normal
1612	4	2025-04-23 10:44:46.402145+03	\N	2	2	40	normal
1613	4	2025-04-23 10:45:44.487566+03	\N	0	0	0	normal
1614	4	2025-04-23 10:45:51.615269+03	\N	0	0	0	normal
1615	4	2025-04-23 10:46:18.290567+03	\N	0	0	0	normal
1599	4	2025-04-21 17:43:51.161593+03	\N	8	7	70	normal
1636	4	2025-04-26 15:08:06.940499+03	\N	1	0	0	normal
1637	4	2025-04-26 15:08:47.827671+03	\N	0	0	0	normal
1638	4	2025-04-26 15:09:27.764326+03	\N	0	0	0	normal
1624	5	2025-04-26 10:17:00.014038+03	\N	13	13	130	normal
1600	4	2025-04-21 17:45:08.56405+03	2025-04-21 17:46:00.394417+03	5	4	80	normal
1616	5	2025-04-24 14:13:52.581016+03	2025-04-24 14:14:16.743661+03	5	5	74	normal
1617	5	2025-04-24 14:14:21.464702+03	\N	0	0	0	normal
1639	4	2025-04-26 15:09:41.20506+03	\N	0	0	0	normal
1640	4	2025-04-26 15:10:02.835076+03	\N	0	0	0	normal
1601	4	2025-04-22 08:30:31.582394+03	2025-04-22 08:31:23.195892+03	5	4	0	normal
1602	4	2025-04-22 08:31:45.32414+03	\N	0	0	0	normal
1618	5	2025-04-24 15:24:45.231184+03	\N	3	3	0	normal
1603	4	2025-04-22 08:32:14.811703+03	\N	2	1	10	normal
1619	5	2025-04-24 15:25:09.086586+03	\N	1	0	0	normal
1641	4	2025-04-26 15:11:59.422654+03	\N	0	0	0	normal
1642	4	2025-04-26 15:12:05.86161+03	\N	0	0	0	normal
1620	5	2025-04-24 15:26:33.056359+03	\N	2	2	29	normal
1621	5	2025-04-24 15:26:50.157898+03	\N	0	0	0	normal
1622	5	2025-04-24 15:27:00.984372+03	\N	2	2	0	normal
1623	5	2025-04-26 10:16:48.720888+03	\N	0	0	0	normal
1625	5	2025-04-26 10:18:14.322648+03	2025-04-26 10:18:39.288321+03	5	5	50	normal
1626	5	2025-04-26 10:23:49.688695+03	\N	0	0	0	normal
1627	5	2025-04-26 10:23:53.479272+03	\N	0	0	0	normal
1628	5	2025-04-26 10:27:42.786544+03	\N	0	0	0	normal
1629	5	2025-04-26 10:27:48.951909+03	\N	0	0	0	normal
1630	5	2025-04-26 10:33:05.930205+03	\N	0	0	0	normal
1643	4	2025-04-26 15:12:13.270612+03	\N	1	1	10	normal
1644	4	2025-04-26 15:12:29.480038+03	\N	0	0	0	normal
1645	4	2025-04-26 15:12:36.166963+03	\N	0	0	0	normal
1646	4	2025-04-26 15:12:41.845582+03	\N	0	0	0	normal
1647	4	2025-04-26 15:14:15.303047+03	\N	0	0	0	normal
1648	4	2025-04-26 15:14:28.643146+03	\N	0	0	0	normal
1649	4	2025-04-26 15:14:34.842383+03	\N	0	0	0	normal
1650	4	2025-04-26 15:15:25.330615+03	\N	0	0	0	normal
1651	4	2025-04-26 15:20:35.879428+03	\N	0	0	0	normal
1657	4	2025-04-27 10:59:27.819983+03	\N	3	1	0	normal
1653	4	2025-04-26 18:14:13.091132+03	\N	2	1	0	normal
1654	4	2025-04-26 18:14:36.345433+03	\N	0	0	0	normal
1655	4	2025-04-26 18:14:49.662281+03	\N	0	0	0	normal
1656	4	2025-04-26 18:15:03.7598+03	\N	0	0	0	normal
1658	4	2025-04-27 11:57:04.265058+03	\N	1	1	10	normal
1659	4	2025-04-27 12:04:02.66129+03	\N	1	1	20	normal
1660	4	2025-04-27 12:21:21.928031+03	\N	0	0	0	normal
1661	4	2025-04-27 12:22:24.959835+03	\N	1	1	10	normal
1662	4	2025-04-27 12:22:42.574287+03	\N	1	1	10	normal
1663	4	2025-04-29 16:18:34.765454+03	\N	2	1	10	normal
1664	4	2025-04-29 16:19:03.201858+03	\N	2	1	0	normal
1665	4	2025-04-29 16:19:33.273299+03	2025-04-29 16:19:53.25295+03	5	5	50	normal
1666	4	2025-04-29 16:20:00.864047+03	2025-04-29 16:20:29.576017+03	5	5	50	normal
1667	4	2025-04-29 16:20:36.467868+03	2025-04-29 16:20:57.304132+03	5	5	50	normal
1668	4	2025-04-29 16:21:06.310451+03	\N	1	1	10	normal
1669	4	2025-05-05 13:30:29.369976+03	\N	2	1	15	normal
1670	4	2025-05-05 13:30:53.416565+03	\N	2	2	0	normal
1671	4	2025-05-05 13:31:09.569691+03	\N	0	0	0	normal
1672	4	2025-05-05 13:31:17.566581+03	\N	0	0	0	normal
1673	4	2025-05-05 13:31:27.21724+03	\N	2	2	0	normal
1674	4	2025-05-05 13:35:37.300331+03	\N	3	2	30	normal
1675	4	2025-05-05 13:36:08.917137+03	\N	1	1	0	normal
1676	4	2025-05-05 13:36:15.878715+03	\N	2	1	14	normal
1677	4	2025-05-05 13:36:33.928429+03	\N	0	0	0	normal
1678	4	2025-05-05 13:36:44.940197+03	\N	0	0	0	normal
1679	4	2025-05-05 13:37:26.714585+03	2025-05-05 13:37:55.36131+03	5	4	0	normal
1680	7	2025-05-07 19:56:18.766534+03	2025-05-07 19:56:44.462111+03	5	4	40	normal
1681	7	2025-05-07 19:57:10.31482+03	\N	1	1	0	normal
1682	7	2025-05-07 19:57:25.434738+03	\N	0	0	0	normal
1683	7	2025-05-07 19:57:42.183713+03	\N	1	1	10	normal
1684	7	2025-05-07 19:57:59.877874+03	\N	1	1	0	normal
\.


--
-- TOC entry 3682 (class 0 OID 16410)
-- Dependencies: 218
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.levels (level_id, level_name, description, required_points, category, max_difficulty) FROM stdin;
1	Addition Beginner	Simple addition with numbers 1-10	0	Addition	1
2	Addition Intermediate	Addition with numbers up to 20	100	Addition	2
3	Addition Advanced	Multi-digit addition and word problems	250	Addition	3
4	Subtraction Beginner	Simple subtraction with numbers 1-10	400	Subtraction	1
5	Subtraction Intermediate	Subtraction with numbers up to 20	600	Subtraction	2
6	Subtraction Advanced	Multi-digit subtraction and word problems	850	Subtraction	3
7	Multiplication Beginner	Simple multiplication with numbers 1-5	1100	Multiplication	1
8	Multiplication Intermediate	Multiplication with numbers up to 10	1400	Multiplication	2
9	Multiplication Advanced	Multi-digit multiplication and word problems	1700	Multiplication	3
10	Division Beginner	Simple division with numbers 1-10	2000	Division	1
11	Division Intermediate	Division with remainders	2350	Division	2
12	Division Advanced	Multi-digit division and word problems	2700	Division	3
13	Fraction Basics	Introduction to fractions with simple operations	3100	Fractions	2
14	Fraction Operations	Advanced operations with fractions	3500	Fractions	3
\.


--
-- TOC entry 3684 (class 0 OID 16416)
-- Dependencies: 220
-- Data for Name: problems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.problems (problem_id, category, difficulty_level, question, correct_answer, options, points, problem_type) FROM stdin;
109	Subtraction	1	8 - 3 = ?	5	{3,4,5,6}	10	basic
110	Subtraction	1	What is 7 - 4?	3	{1,2,3,4}	10	basic
111	Subtraction	1	6 - 2 = ?	4	{2,3,4,5}	10	basic
112	Subtraction	2	45 - 27 = ?	18	{8,18,28,38}	15	multi-digit
113	Subtraction	2	What is 63 - 45?	18	{8,18,28,38}	15	multi-digit
114	Subtraction	2	82 - 53 = ?	29	{19,29,39,49}	15	multi-digit
115	Subtraction	3	456 - 289 = ?	167	{157,167,177,187}	20	multi-digit
116	Subtraction	3	732 - 456 = ?	276	{266,276,286,296}	20	multi-digit
117	Multiplication	1	4 × 3 = ?	12	{9,10,11,12}	10	basic
118	Multiplication	1	What is 5 × 2?	10	{8,9,10,11}	10	basic
119	Multiplication	1	6 × 2 = ?	12	{10,11,12,13}	10	basic
120	Multiplication	2	12 × 5 = ?	60	{50,55,60,65}	15	multi-digit
121	Multiplication	2	What is 14 × 4?	56	{46,56,66,76}	15	multi-digit
122	Multiplication	2	17 × 3 = ?	51	{41,51,61,71}	15	multi-digit
123	Multiplication	3	24 × 17 = ?	408	{398,408,418,428}	20	multi-digit
124	Multiplication	3	36 × 25 = ?	900	{890,900,910,920}	20	multi-digit
125	Division	1	12 ÷ 3 = ?	4	{2,3,4,5}	10	basic
126	Division	1	What is 15 ÷ 5?	3	{2,3,4,5}	10	basic
127	Division	1	10 ÷ 2 = ?	5	{3,4,5,6}	10	basic
128	Division	2	48 ÷ 6 = ?	8	{6,7,8,9}	15	multi-digit
129	Division	2	What is 72 ÷ 9?	8	{6,7,8,9}	15	multi-digit
130	Division	2	56 ÷ 7 = ?	8	{6,7,8,9}	15	multi-digit
131	Division	3	144 ÷ 12 = ?	12	{10,11,12,13}	20	multi-digit
132	Division	3	360 ÷ 36 = ?	10	{8,9,10,11}	20	multi-digit
133	Fractions	1	What is 1/2 + 1/2?	1	{0,1/2,1,2}	10	basic
134	Fractions	1	1/4 of 8 = ?	2	{1,2,3,4}	10	basic
135	Fractions	1	What is 1/3 of 9?	3	{2,3,4,5}	10	basic
136	Fractions	2	1/4 + 1/4 = ?	1/2	{1/3,1/2,2/3,3/4}	15	addition
137	Fractions	2	3/4 - 1/4 = ?	1/2	{1/3,1/2,2/3,3/4}	15	subtraction
138	Fractions	2	1/2 × 6 = ?	3	{2,3,4,5}	15	multiplication
139	Fractions	3	2/3 ÷ 1/2 = ?	4/3	{2/3,3/4,4/3,5/3}	20	complex
140	Fractions	3	3/4 + 1/6 = ?	11/12	{5/6,7/12,11/12,13/12}	20	complex
141	Decimals	1	0.5 + 0.5 = ?	1	{0.5,0.75,1,1.5}	10	basic
142	Decimals	1	What is 0.2 × 5?	1	{0.5,0.75,1,1.5}	10	basic
143	Decimals	1	0.3 + 0.4 = ?	0.7	{0.5,0.6,0.7,0.8}	10	basic
144	Decimals	2	1.5 + 2.3 = ?	3.8	{3.6,3.7,3.8,3.9}	15	multi-digit
145	Decimals	2	4.2 ÷ 2 = ?	2.1	{1.9,2.0,2.1,2.2}	15	multi-digit
146	Decimals	2	0.6 × 3 = ?	1.8	{1.6,1.7,1.8,1.9}	15	multi-digit
147	Decimals	3	2.5 + 1.75 = ?	4.25	{4.05,4.15,4.25,4.35}	20	complex
148	Decimals	3	3.6 ÷ 1.2 = ?	3	{2.8,2.9,3,3.1}	20	complex
149	Geometry	1	A square has sides of 3 cm. What is its perimeter?	12	{9,10,12,15}	10	perimeter
150	Geometry	1	A rectangle is 4 cm long and 3 cm wide. What is its area?	12	{10,11,12,13}	10	area
151	Geometry	1	How many sides does a triangle have?	3	{2,3,4,5}	10	basic
152	Geometry	2	A rectangle is 5 cm long and 4 cm wide. What is its perimeter?	18	{16,17,18,19}	15	perimeter
153	Geometry	2	A square has a side length of 6 cm. What is its area?	36	{30,33,36,39}	15	area
154	Geometry	2	What is the sum of angles in a triangle?	180	{90,120,180,360}	15	angles
155	Geometry	3	A circle has a radius of 7 cm. What is its circumference? (π ≈ 3.14)	44	{40,42,44,46}	20	complex
156	Geometry	3	A triangle has sides 5 cm, 6 cm, and 7 cm. What is its perimeter?	18	{16,17,18,19}	20	complex
157	Word Problems	1	Sarah has 5 stickers. Her friend gives her 3 more. How many stickers does she have?	8	{6,7,8,9}	10	addition
158	Word Problems	1	Tom has 10 cookies. He eats 4. How many cookies are left?	6	{4,5,6,7}	10	subtraction
159	Word Problems	1	A box has 3 rows of 4 candies. How many candies are in the box?	12	{10,11,12,13}	10	multiplication
160	Word Problems	2	A bakery sells 12 muffins in the morning and 18 in the afternoon. How many muffins did they sell in total?	30	{28,29,30,31}	15	mixed
161	Word Problems	2	John has 24 stickers and wants to share them equally among 6 friends. How many stickers will each friend get?	4	{3,4,5,6}	15	division
162	Word Problems	2	Lisa ate 1/4 of a pizza. Her brother ate 1/2 of the same pizza. How much of the pizza is left?	1/4	{1/3,1/4,1/2,2/3}	15	fractions
163	Word Problems	3	A school has 156 students in the morning and 187 students in the afternoon. How many students are there in total?	343	{333,343,353,363}	20	complex
164	Word Problems	3	A farmer has chickens and cows. If the total number of animal heads is 80 and the total number of legs is 260, how many chickens does the farmer have?	60	{50,55,60,65}	20	complex
165	Addition	1	What is 2 + 6?	8	{7,8,9,10}	10	basic
166	Addition	1	5 + 4 = ?	9	{8,9,10,11}	10	basic
167	Addition	1	Add 3 and 7	10	{9,10,11,12}	10	basic
168	Addition	2	What is 35 + 46?	81	{71,81,91,101}	15	multi-digit
169	Addition	2	58 + 29 = ?	87	{77,87,97,107}	15	multi-digit
170	Addition	2	Solve 64 + 18	82	{72,82,92,102}	15	multi-digit
171	Addition	3	Calculate 312 + 489	801	{791,801,811,821}	20	multi-digit
172	Addition	3	678 + 345 = ?	1023	{1013,1023,1033,1043}	20	multi-digit
173	Subtraction	1	9 - 4 = ?	5	{4,5,6,7}	10	basic
174	Subtraction	1	What is 6 - 2?	4	{3,4,5,6}	10	basic
175	Subtraction	1	7 - 5 = ?	2	{1,2,3,4}	10	basic
176	Subtraction	2	54 - 28 = ?	26	{24,25,26,27}	15	multi-digit
177	Subtraction	2	What is 73 - 39?	34	{33,34,35,36}	15	multi-digit
178	Subtraction	2	91 - 47 = ?	44	{43,44,45,46}	15	multi-digit
179	Subtraction	3	523 - 278 = ?	245	{235,245,255,265}	20	multi-digit
180	Subtraction	3	845 - 396 = ?	449	{439,449,459,469}	20	multi-digit
181	Multiplication	1	3 × 4 = ?	12	{11,12,13,14}	10	basic
182	Multiplication	1	What is 6 × 2?	12	{10,11,12,13}	10	basic
183	Multiplication	1	5 × 3 = ?	15	{14,15,16,17}	10	basic
184	Multiplication	2	13 × 6 = ?	78	{76,77,78,79}	15	multi-digit
185	Multiplication	2	What is 15 × 4?	60	{58,59,60,61}	15	multi-digit
186	Multiplication	2	18 × 5 = ?	90	{88,89,90,91}	15	multi-digit
81	Addition	1	2 + 3 = ?	5	{4,5,6,7}	10	basic
82	Addition	1	1 + 7 = ?	8	{7,8,9,10}	10	basic
83	Addition	1	4 + 5 = ?	9	{8,9,10,11}	10	basic
84	Addition	1	6 + 2 = ?	8	{7,8,9,10}	10	basic
85	Addition	1	3 + 6 = ?	9	{8,9,10,11}	10	basic
86	Addition	1	5 + 4 = ?	9	{8,9,10,11}	10	basic
87	Addition	1	7 + 1 = ?	8	{7,8,9,10}	10	basic
88	Addition	1	2 + 7 = ?	9	{8,9,10,11}	10	basic
89	Addition	1	3 + 5 = ?	8	{7,8,9,10}	10	basic
90	Addition	1	4 + 3 = ?	7	{6,7,8,9}	10	basic
91	Addition	1	0 + 6 = ?	6	{5,6,7,8}	10	zero
92	Addition	1	8 + 0 = ?	8	{7,8,9,10}	10	zero
93	Addition	1	5 + 0 = ?	5	{4,5,6,7}	10	zero
94	Addition	2	12 + 14 = ?	26	{24,25,26,27}	15	multi-digit
95	Addition	2	23 + 45 = ?	68	{66,67,68,69}	15	multi-digit
96	Addition	2	37 + 26 = ?	63	{61,62,63,64}	15	multi-digit
97	Addition	2	54 + 39 = ?	93	{91,92,93,94}	15	multi-digit
98	Addition	2	18 + 47 = ?	65	{63,64,65,66}	15	multi-digit
99	Addition	2	62 + 29 = ?	91	{89,90,91,92}	15	multi-digit
100	Addition	2	45 + 38 = ?	83	{81,82,83,84}	15	multi-digit
101	Addition	2	27 + 56 = ?	83	{81,82,83,84}	15	multi-digit
102	Addition	2	39 + 44 = ?	83	{81,82,83,84}	15	multi-digit
103	Addition	2	56 + 27 = ?	83	{81,82,83,84}	15	multi-digit
104	Addition	3	123 + 456 = ?	579	{577,578,579,580}	20	multi-digit
105	Addition	3	247 + 365 = ?	612	{610,611,612,613}	20	multi-digit
106	Addition	3	519 + 237 = ?	756	{754,755,756,757}	20	multi-digit
107	Addition	3	386 + 472 = ?	858	{856,857,858,859}	20	multi-digit
108	Addition	3	645 + 289 = ?	934	{932,933,934,935}	20	multi-digit
187	Multiplication	3	27 × 19 = ?	513	{503,513,523,533}	20	multi-digit
188	Multiplication	3	42 × 23 = ?	966	{956,966,976,986}	20	multi-digit
189	Division	1	16 ÷ 4 = ?	4	{3,4,5,6}	10	basic
190	Division	1	What is 20 ÷ 5?	4	{3,4,5,6}	10	basic
191	Division	1	18 ÷ 3 = ?	6	{5,6,7,8}	10	basic
192	Division	2	64 ÷ 8 = ?	8	{7,8,9,10}	15	multi-digit
193	Division	2	What is 81 ÷ 9?	9	{8,9,10,11}	15	multi-digit
194	Division	2	72 ÷ 6 = ?	12	{11,12,13,14}	15	multi-digit
195	Division	3	156 ÷ 12 = ?	13	{12,13,14,15}	20	multi-digit
196	Division	3	432 ÷ 36 = ?	12	{11,12,13,14}	20	multi-digit
197	Fractions	1	What is 1/3 + 1/3?	2/3	{1/3,2/3,3/3,4/3}	10	basic
198	Fractions	1	1/2 of 10 = ?	5	{4,5,6,7}	10	basic
199	Fractions	1	What is 1/5 of 15?	3	{2,3,4,5}	10	basic
200	Fractions	2	What is 3/4 - 1/2?	1/4	{1/4,1/2,2/4,3/4}	15	operations
201	Fractions	2	Add: 2/5 + 1/5	3/5	{2/5,3/5,4/5,5/5}	15	operations
202	Fractions	2	Multiply: 2/3 × 3/4	1/2	{1/2,2/3,3/4,5/6}	15	operations
203	Fractions	3	Divide: (3/5) ÷ (2/3)	9/10	{6/8,9/10,10/9,8/9}	20	operations
204	Fractions	3	Simplify: (8/12)	2/3	{2/3,4/5,3/4,1/2}	20	operations
205	Fractions	3	John ate 3/8 of a pie and Mary ate 1/4. How much did they eat together?	5/8	{1/2,5/8,6/8,3/4}	20	word
206	Geometry	1	How many sides does a triangle have?	3	{3,4,5,6}	10	shapes
207	Geometry	1	How many corners does a square have?	4	{3,4,5,6}	10	shapes
208	Geometry	1	How many sides does a rectangle have?	4	{3,4,5,6}	10	shapes
209	Geometry	2	What is the area of a rectangle with length 5 and width 3?	15	{8,15,18,20}	15	area
210	Geometry	2	Perimeter of a square with side 6?	24	{18,20,24,26}	15	perimeter
211	Geometry	2	How many degrees in a right angle?	90	{45,90,180,360}	15	angles
212	Geometry	3	Volume of a cube with side 4?	64	{16,32,64,128}	20	volume
213	Geometry	3	Area of a triangle with base 10 and height 4?	20	{10,20,30,40}	20	area
214	Geometry	3	How many degrees in a triangle?	180	{90,180,270,360}	20	angles
215	Word Problems	1	Tom has 3 apples and buys 2 more. How many does he have?	5	{4,5,6,7}	10	basic
216	Word Problems	1	Sara has 10 candies and gives 4 away. How many left?	6	{5,6,7,8}	10	basic
217	Word Problems	2	Alex buys 3 pens at $2 each. What is the total cost?	6	{5,6,7,8}	15	multi-step
218	Word Problems	2	A bag holds 8 balls. How many in 4 bags?	32	{30,32,34,36}	15	multi-step
219	Word Problems	3	If a train travels 60 km in 1 hour, how far in 2.5 hours?	150	{100,120,150,180}	20	logic
220	Word Problems	3	A box contains 5 red, 3 blue, and 2 green balls. What is the probability of picking a red one?	0.5	{0.3,0.5,0.6,0.7}	20	logic
\.


--
-- TOC entry 3686 (class 0 OID 16424)
-- Dependencies: 222
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_achievements (user_id, achievement_id, earned_at) FROM stdin;
2	4	2025-04-21 12:03:25.009944+03
2	5	2025-04-21 12:03:25.023342+03
3	4	2025-04-21 12:14:34.075658+03
3	10	2025-04-21 12:14:34.077179+03
3	5	2025-04-21 12:29:42.01708+03
4	4	2025-04-21 12:34:05.329686+03
4	9	2025-04-21 12:34:05.331941+03
4	10	2025-04-21 12:34:05.335796+03
4	16	2025-04-21 17:46:00.542921+03
4	5	2025-04-21 17:46:00.545592+03
5	4	2025-04-24 14:14:16.854637+03
5	9	2025-04-24 14:14:16.858284+03
5	10	2025-04-24 14:14:16.859593+03
5	16	2025-04-26 10:18:39.407614+03
5	5	2025-04-26 10:18:39.411396+03
5	11	2025-04-26 10:18:39.419578+03
4	6	2025-04-29 16:19:53.369624+03
4	8	2025-04-29 16:20:29.653167+03
\.


--
-- TOC entry 3687 (class 0 OID 16428)
-- Dependencies: 223
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (profile_id, user_id, avatar, username_color, created_at, updated_at) FROM stdin;
1	1	avatar4	#9C27B0	2025-04-20 19:12:38.880961+03	2025-04-20 19:12:38.880961+03
3	5	avatar3	#9C27B0	2025-04-24 15:24:16.242201+03	2025-04-24 15:24:16.242201+03
2	4	avatar1	#FF9800	2025-04-21 12:58:56.465658+03	2025-04-21 12:58:56.465658+03
4	7	avatar3	#9C27B0	2025-05-07 19:55:51.623574+03	2025-05-07 19:55:51.623574+03
\.


--
-- TOC entry 3689 (class 0 OID 16436)
-- Dependencies: 225
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (progress_id, user_id, current_level, total_points, problems_solved, last_updated) FROM stdin;
3	3	2	238	20	2025-04-21 12:14:05.033844+03
1	1	3	125	12	2025-04-20 18:57:29.877482+03
4	4	5	659	74	2025-04-21 12:33:33.923714+03
6	6	1	0	0	2025-05-07 19:25:52.59262+03
7	7	1	50	7	2025-05-07 19:55:31.738512+03
5	5	6	367	34	2025-04-24 13:18:04.752221+03
2	2	5	252	21	2025-04-21 11:44:07.510487+03
\.


--
-- TOC entry 3691 (class 0 OID 16444)
-- Dependencies: 227
-- Data for Name: user_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_records (record_id, user_id, record_type, record_value, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3693 (class 0 OID 16452)
-- Dependencies: 229
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, email, created_at, last_login) FROM stdin;
1	KarimMenem	$2b$10$AcZVXYH0j9Pq45RfPFTkuOyQ04vVmUUW0RE6j3.vig5mF12sEyG3O	karimmenem2@hotmail.com	2025-04-20 18:57:29.875165+03	2025-04-21 11:42:26.270825+03
2	KarimMenem2	$2b$10$vNKnNTf6KRLHJD53ROvtWukuv7jIlAFzx/OqOjqNGmcCfvyK.BMAS	karimmenem@gmail.com	2025-04-21 11:44:07.507695+03	2025-04-21 11:57:34.458716+03
3	dunkydooo2	$2b$10$.sYe7rzrSv9wUqX82spswen2c8Wlkbb4bqp2omSS2/4KwgLAEe.z.	dunkydoo2@gmail.com	2025-04-21 12:14:05.031908+03	2025-04-21 12:14:05.116612+03
6	karimpresent	$2b$10$9CFU74qmW.KqvjY1sn8L0.YC1Qt7mhD5uJ0FhpCQ2C2.o5NScBxM2	karimmenempresent2@gmail.com	2025-05-07 19:25:52.571061+03	2025-05-07 19:25:52.682293+03
7	karimmenem8	$2b$10$JLNhGgZXJs0tXQLwgIcgVOnt.EqJv633HSzg9voSv8iERrnO3a/Gq	karimmenem9@gmail.com	2025-05-07 19:55:31.73522+03	2025-05-07 19:55:31.827789+03
4	karimmenem4	$2b$10$BFMXTVbqticO0vdFN8q.kOIsE4IyV/nUSSMt0d2.LgqrGI1djZGD6	testingkarim@gmail.com	2025-04-21 12:33:33.919025+03	2025-05-07 20:04:11.797212+03
5	KarimMenem3	$2b$10$JA5.CpUEHzCqHdV/IAiB4.Hgjbd3V3VKxj103tH3nuQVpAbhVNakG	karimmenem3@hotmail.com	2025-04-24 13:18:04.734307+03	2025-04-26 10:16:34.973467+03
\.


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 215
-- Name: achievements_achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.achievements_achievement_id_seq', 28, true);


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_sessions_session_id_seq', 1684, true);


--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 219
-- Name: levels_level_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.levels_level_id_seq', 14, true);


--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 221
-- Name: problems_problem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.problems_problem_id_seq', 220, true);


--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_profiles_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_profiles_profile_id_seq', 4, true);


--
-- TOC entry 3713 (class 0 OID 0)
-- Dependencies: 226
-- Name: user_progress_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progress_progress_id_seq', 7, true);


--
-- TOC entry 3714 (class 0 OID 0)
-- Dependencies: 228
-- Name: user_records_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_records_record_id_seq', 1, false);


--
-- TOC entry 3715 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 7, true);


--
-- TOC entry 3506 (class 2606 OID 16466)
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (achievement_id);


--
-- TOC entry 3508 (class 2606 OID 16468)
-- Name: game_sessions game_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 3510 (class 2606 OID 16470)
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (level_id);


--
-- TOC entry 3512 (class 2606 OID 16472)
-- Name: problems problems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_pkey PRIMARY KEY (problem_id);


--
-- TOC entry 3521 (class 2606 OID 16474)
-- Name: user_records unique_user_record_type; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records
    ADD CONSTRAINT unique_user_record_type UNIQUE (user_id, record_type);


--
-- TOC entry 3514 (class 2606 OID 16476)
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (user_id, achievement_id);


--
-- TOC entry 3517 (class 2606 OID 16478)
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (profile_id);


--
-- TOC entry 3519 (class 2606 OID 16480)
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (progress_id);


--
-- TOC entry 3523 (class 2606 OID 16482)
-- Name: user_records user_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records
    ADD CONSTRAINT user_records_pkey PRIMARY KEY (record_id);


--
-- TOC entry 3525 (class 2606 OID 16484)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3527 (class 2606 OID 16486)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3529 (class 2606 OID 16488)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3515 (class 1259 OID 16489)
-- Name: idx_user_profiles_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_user_profiles_user_id ON public.user_profiles USING btree (user_id);


--
-- TOC entry 3530 (class 2606 OID 16490)
-- Name: game_sessions game_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3531 (class 2606 OID 16495)
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(achievement_id) ON DELETE CASCADE;


--
-- TOC entry 3532 (class 2606 OID 16500)
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3533 (class 2606 OID 16505)
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3534 (class 2606 OID 16510)
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3535 (class 2606 OID 16515)
-- Name: user_records user_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records
    ADD CONSTRAINT user_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-05-09 11:28:02 EEST

--
-- PostgreSQL database dump complete
--

