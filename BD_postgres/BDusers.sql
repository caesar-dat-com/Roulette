--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-04-03 11:19:50

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

DROP TABLE IF EXISTS public.users CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    alias character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    balance numeric(10,2) DEFAULT 0
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_alias_key UNIQUE (alias);

ALTER TABLE public.users OWNER TO postgres;
ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

COPY public.users (id, name, email, alias, password, balance) FROM stdin;
1	Amanda Gonzales	huffvirginia@yahoo.com	amanda93	Jep$6N*oCX	665.48
2	Maria Harrell	heather46@hensley.biz	john40	DljiEJne%2	431.17
3	Alejandro Taylor	hnunez@merritt.net	iburgess	_Z0GqcwXr6	311.38
4	Alicia Garrett	burnsrichard@williams-kramer.info	taylorwilliam	8u2#Q&Aoa^	245.44
5	Jeremy Martinez	nixondiana@castillo.com	qgonzalez	^YDNieam90	440.63
6	Ian Byrd	freemanjose@gmail.com	haileyrodriguez	*7TGlJZlrk	115.76
7	Diane Kelley	smithlauren@greene.net	collinsoscar	%cT47Dacdf	13.04
8	Kelly Collins	marydavis@hotmail.com	leechristopher	1@E5B4z+^Y	189.55
9	Rebecca Lopez	tarariley@gmail.com	thomasmckinney	n9RMROFi$#	443.44
10	Kristen Campbell	steven79@strong-scott.info	brianjackson	$t7YLXNiXF	568.28
11	Leslie Hernandez	ylynch@yahoo.com	evansmith	GC#%qEly+1	85.18
12	Valerie Booth	brian07@jordan-jones.com	paulromero	_YrEZQlj!0	198.14
13	Terri Anderson	hhouse@sellers-clark.com	steven98	hky3^3Wv)g	653.11
14	Alicia Davis	hughesalex@moreno.com	lmiller	pPS0fDOg_C	523.10
15	Andrew Lowe	jesse41@hanna-mitchell.com	suzanne78	@48SNt4g$Q	745.86
16	Bryce Gordon	hbrown@cohen-ross.com	jason75	zA8S(trbv*	473.56
17	Robin Rice	eric54@brooks.com	bradleysloan	$817TttmQH	723.54
18	Gerald Butler	ckemp@yahoo.com	charlessmith	y9Pcg@Q*@E	679.25
19	Michelle Solomon	jordan45@smith.com	scott21	))wCozgA(3	31.19
20	Joshua Hernandez	stevenwoods@hotmail.com	justin99	17VN*Ydg@y	457.79
21	Michael Alexander	julie82@yahoo.com	troy75	)2Si!*#3kI	369.11
22	Jesus Powell	selenasmith@hotmail.com	catherine08	O9TCkp0k#q	375.91
23	Robert Duffy	davenportelizabeth@gmail.com	jennifer20	@#2WZMrVw9	386.50
24	Tracey Jackson	rachel68@patel.com	lauranunez	0^+44ATgCn	509.49
25	Derek Richardson	cyoung@gmail.com	leslierasmussen	$BY*VVcG1%	12.73
26	Anthony Morales	alison69@hernandez.com	danielparks	@n$GurdK(6	615.46
27	Samantha Stewart	barneslarry@yahoo.com	bhaynes	36R*zr7B_1	131.65
28	Jacob Cooper	markdavis@chan.biz	lopezjessica	G%h$*1eisM	231.58
29	Jodi Mcdonald	fwhite@steele.com	kdavis	+9fIErx!k2	146.20
30	John Mckinney	salazarshane@gmail.com	evalenzuela	XSnvEX(b*6	691.73
31	Kathleen Cole	morrischelsey@king.org	mackenzie45	20cBvovR$n	130.88
32	William Hunt	richard12@mccullough.com	courtney37	@2Tinq^I(W	906.13
33	Jessica Fowler	hokelsey@yahoo.com	nina74	*TT&ohl&4o	569.98
34	Adam Wood	ogreen@hotmail.com	nclay	abUhT3Fst)	370.83
35	Devin Avery	unelson@hotmail.com	hickschristy	kxG8vFHn)n	647.95
36	Ashley Ford	michaelfowler@farrell-watkins.com	mcarlson	$#1FtIazNF	542.06
37	Colton Acevedo	sheri32@jones.com	nelsontracey	(xQPY+Sf3e	384.93
38	Michelle Sawyer	bennettemily@gmail.com	lynnzamora	$gVne+q$E5	536.01
39	Wesley Day	lindacooper@fernandez-contreras.com	adamsdarrell	U%S^7dJb^u	273.80
40	Christopher Larson	jasmineelliott@gmail.com	beckclayton	P165eKeb&^	339.58
41	William Butler	gina18@everett.com	andersonlaura	@sM)bd3_r5	458.33
42	Denise Sweeney	adamsshelly@yahoo.com	jocelyn11	$77ijFIkUF	663.01
43	Abigail Cobb	lorijackson@gmail.com	johnramos	2_7QIgcRZ&	728.89
44	Chad Stanton	john07@yahoo.com	allenbrent	!m8XTkrp04	155.29
45	Benjamin Pearson	karl16@richard.com	amber45	4C8ERYgc@o	891.45
46	Hunter Allen	lisagray@andrews.net	martindesiree	s0PRY@H((k	469.40
47	Alexander Rodriguez	amycarpenter@yahoo.com	sheri70	^7xdntS9oy	151.14
48	Cassidy Cole	bryanttimothy@adams.com	kimberly98	S3edQ2hd($	99.20
49	Kimberly Brandt	gibsonstephanie@hotmail.com	benjamin80	N(8Ku!_h)B	201.95
50	Brianna Nichols	ujordan@hotmail.com	harrismichelle	y@47oDOd2E	641.12
\.

SELECT pg_catalog.setval('public.users_id_seq', 51, true);
