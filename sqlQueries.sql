-- Table: public.chatlogs

-- DROP TABLE public.chatlogs;

CREATE TABLE public.chatlogs
(
  id serial primary key,
  sendername character varying(50),
  message text,
  createdate timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.chatlogs
  OWNER TO ouningwemyxhot;

-- Index: public.chatlogs_create_date_index

-- DROP INDEX public.chatlogs_create_date_index;

CREATE INDEX chatlogs_create_date_index
  ON public.chatlogs
  USING btree
  (createdate);
