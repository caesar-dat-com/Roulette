--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-04-03 11:19:20

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
-- TOC entry 216 (class 1259 OID 24620)
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    nombre character varying(100),
    descripcion text,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    activo boolean
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24619)
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_seq OWNER TO postgres;

--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 215
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- TOC entry 4688 (class 2604 OID 24623)
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- TOC entry 4835 (class 0 OID 24620)
-- Dependencies: 216
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id, nombre, descripcion, start_time, end_time, activo) FROM stdin;
1	Intuitive upward-trending firmware	Sometimes enter hundred now least beat race seat Mr morning manager treat.	2025-01-17 21:19:26	2025-03-09 12:32:30	f
2	Visionary national hub	Sing art large necessary somebody gun.	2025-02-27 17:58:48	2025-03-19 18:41:36	t
3	Customer-focused clear-thinking support	Finally expert seat professional president history participant set hit tax final scientist coach.	2025-04-02 06:09:42	2025-04-03 01:52:59	f
4	Progressive web-enabled archive	Carry training must next value blue pattern attorney look avoid size.	2025-01-18 04:39:13	2025-02-04 16:19:06	t
5	Enhanced fault-tolerant infrastructure	Writer most night so allow war discussion social.	2025-03-04 19:37:44	2025-03-31 08:58:36	f
6	Decentralized upward-trending functionalities	Decision true player word watch event season speech yourself window dream thought develop.	2025-02-15 23:53:17	2025-03-23 08:00:17	f
7	Innovative context-sensitive policy	Player not live knowledge seek degree cultural rather price kid story.	2025-01-20 04:05:29	2025-01-27 17:21:46	t
8	Horizontal coherent concept	War purpose involve public parent born while way there media claim as.	2025-01-22 07:55:23	2025-01-28 02:08:09	f
9	Operative value-added artificial intelligence	All any push light responsibility performance.	2025-03-11 16:40:44	2025-03-20 00:09:42	f
10	Sharable multi-tasking strategy	Catch when change family share history.	2025-03-14 23:03:51	2025-03-18 17:37:25	f
\.


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 215
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_seq', 1, false);


--
-- TOC entry 4690 (class 2606 OID 24627)
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


-- Completed on 2025-04-03 11:19:20

--
-- PostgreSQL database dump complete
--

