--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-04-03 11:19:04

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
-- TOC entry 216 (class 1259 OID 24587)
-- Name: statistics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statistics (
    id integer NOT NULL,
    total_rounds integer,
    total_red_wins integer,
    total_black_wins integer,
    total_even_wins integer,
    total_odd_wins integer,
    total_zero_wins integer
);


ALTER TABLE public.statistics OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24586)
-- Name: statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statistics_id_seq OWNER TO postgres;

--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 215
-- Name: statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statistics_id_seq OWNED BY public.statistics.id;


--
-- TOC entry 4688 (class 2604 OID 24590)
-- Name: statistics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics ALTER COLUMN id SET DEFAULT nextval('public.statistics_id_seq'::regclass);


--
-- TOC entry 4835 (class 0 OID 24587)
-- Dependencies: 216
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statistics (id, total_rounds, total_red_wins, total_black_wins, total_even_wins, total_odd_wins, total_zero_wins) FROM stdin;
1	100000	48615	48674	51120	48880	480
\.


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 215
-- Name: statistics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statistics_id_seq', 1, false);


--
-- TOC entry 4690 (class 2606 OID 24592)
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


-- Completed on 2025-04-03 11:19:04

--
-- PostgreSQL database dump complete
--

