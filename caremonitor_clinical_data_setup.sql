-- Database: caremonitor_clinical_data

-- DROP DATABASE IF EXISTS caremonitor_clinical_data;

CREATE DATABASE caremonitor_clinical_data
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Table: public.patients

-- DROP TABLE IF EXISTS public.patients;

CREATE TABLE IF NOT EXISTS public.patients
(
    patient_id text COLLATE pg_catalog."default" NOT NULL,
    org_id text COLLATE pg_catalog."default" NOT NULL,
    height integer,
    from_healthkit_sync boolean NOT NULL DEFAULT true,
    "timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT patients_pkey PRIMARY KEY (patient_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.patients
    OWNER to postgres;

-- Table: public.blood_glucose

-- DROP TABLE IF EXISTS public.blood_glucose;

CREATE TABLE IF NOT EXISTS public.blood_glucose
(
    on_date timestamp with time zone NOT NULL,
    measurement numeric(5,2) NOT NULL,
    uom character varying(20) COLLATE pg_catalog."default" DEFAULT 'mmol/L'::character varying,
    patient_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.blood_glucose
    OWNER to postgres;

-- Table: public.blood_pressure

-- DROP TABLE IF EXISTS public.blood_pressure;

CREATE TABLE IF NOT EXISTS public.blood_pressure
(
    on_date timestamp with time zone NOT NULL,
    measurement integer NOT NULL,
    uom character varying(20) COLLATE pg_catalog."default" DEFAULT 'mmHg'::character varying,
    patient_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.blood_pressure
    OWNER to postgres;

-- Table: public.heart_rate

-- DROP TABLE IF EXISTS public.heart_rate;

CREATE TABLE IF NOT EXISTS public.heart_rate
(
    on_date timestamp with time zone NOT NULL,
    measurement integer NOT NULL,
    uom character varying(20) COLLATE pg_catalog."default" DEFAULT 'beats/min'::character varying,
    patient_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.heart_rate
    OWNER to postgres;

-- Table: public.steps

-- DROP TABLE IF EXISTS public.steps;

CREATE TABLE IF NOT EXISTS public.steps
(
    on_date timestamp with time zone NOT NULL,
    measurement integer NOT NULL,
    uom character varying(20) COLLATE pg_catalog."default" DEFAULT ''::character varying,
    patient_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.steps
    OWNER to postgres;

-- Table: public.weight

-- DROP TABLE IF EXISTS public.weight;

CREATE TABLE IF NOT EXISTS public.weight
(
    on_date timestamp with time zone NOT NULL,
    measurement numeric NOT NULL,
    uom character varying COLLATE pg_catalog."default",
    patient_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.weight
    OWNER to postgres;
