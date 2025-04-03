--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-04-03 11:18:42

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
-- TOC entry 216 (class 1259 OID 24606)
-- Name: bonificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bonificaciones (
    id integer NOT NULL,
    tipo character varying(50),
    descripcion text,
    efecto character varying(20),
    condiciones text
);


ALTER TABLE public.bonificaciones OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24605)
-- Name: bonificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bonificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bonificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 215
-- Name: bonificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bonificaciones_id_seq OWNED BY public.bonificaciones.id;


--
-- TOC entry 4688 (class 2604 OID 24609)
-- Name: bonificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bonificaciones ALTER COLUMN id SET DEFAULT nextval('public.bonificaciones_id_seq'::regclass);


--
-- TOC entry 4835 (class 0 OID 24606)
-- Dependencies: 216
-- Data for Name: bonificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bonificaciones (id, tipo, descripcion, efecto, condiciones) FROM stdin;
1	especial	Condition surface have huge attention already.	saldo extra	Whose particular product east their admit reality total hotel popular.
2	especial	Most bad meeting common.	tiro gratis	Industry me feel cause deal seek interest share business.
3	recarga	Born heart sit fund medical individual risk evidence.	multiplicador	Near quite remain myself current young with.
4	especial	Want affect imagine car interesting for much surface.	doble apuesta	Rate cultural same hope various ever single yes discussion.
5	premio	Final involve full game stand.	doble apuesta	Right trip little book hospital voice great.
6	recarga	Test white share rather power.	multiplicador	Majority side by charge to civil hard.
7	diario	Factor require quickly only cell.	doble apuesta	Group edge understand goal reflect part sit.
8	especial	Half draw significant could.	saldo extra	Experience lead never paper section still whether.
9	premio	Direction I customer man through smile seven point.	tiro gratis	More enter science it.
10	diario	Discussion military paper might person article experience.	saldo extra	Technology child eye style month maybe agreement event technology site.
11	recarga	Day grow act financial why.	doble apuesta	Work son watch central million eat near daughter name drop.
12	diario	Cost election more enter cultural good town.	saldo extra	Generation raise party significant responsibility something mention someone.
13	diario	Price subject never with consumer as peace.	multiplicador	Some benefit wrong loss matter Mr then later.
14	diario	Line wear learn Congress black.	multiplicador	And majority enough sign your run girl beyond.
15	premio	Simply inside career exist leader.	saldo extra	Indeed themselves bring reveal right commercial as.
16	premio	Rate sing attack light.	tiro gratis	Finally amount wait direction enjoy notice.
17	premio	Main right program dog decision.	multiplicador	Gun notice significant act tree pick phone beat bar exactly.
18	recarga	West challenge not determine fact must.	multiplicador	Outside next himself admit discuss once son message.
19	premio	Deal difference police world baby now material.	tiro gratis	Future present debate measure respond blue couple fund author.
20	recarga	Recognize senior some catch about soon.	saldo extra	Next choose successful like including somebody financial also black offer development.
\.


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 215
-- Name: bonificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bonificaciones_id_seq', 1, false);


--
-- TOC entry 4690 (class 2606 OID 24613)
-- Name: bonificaciones bonificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bonificaciones
    ADD CONSTRAINT bonificaciones_pkey PRIMARY KEY (id);


-- Completed on 2025-04-03 11:18:42

--
-- PostgreSQL database dump complete
--

