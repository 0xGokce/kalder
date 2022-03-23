SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';
CREATE TABLE public.brand (
    id integer NOT NULL,
    magic_address character(42) NOT NULL,
    brand_name public.citext,
    account_email public.citext,
    ecomm_backend_id character varying
);
ALTER TABLE public.brand ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.brand_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE public.customer (
    id integer NOT NULL,
    first_name character varying,
    last_name character varying,
    email public.citext,
    phone_number character varying,
    magic_address character(42) NOT NULL,
    external_address character(42)
);
ALTER TABLE public.customer ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE public.nft_collection (
    id integer NOT NULL,
    contract_address character(42),
    mint_start timestamp with time zone,
    mint_end timestamp with time zone,
    brand_id integer,
    mint_price_usd numeric,
    nft_benefits jsonb NOT NULL,
    nft_benefits_version numeric,
    title character varying,
    description character varying,
    brand_mint_revenue_usd numeric,
    brand_royalty_revenue_usd numeric,
    platform_mint_revenue_usd numeric,
    platform_royalty_revenue_usd numeric,
    brand_royalty_percent_of_sale numeric,
    platform_royalty_percent_of_sale numeric,
    CONSTRAINT positive_price CHECK ((mint_price_usd > (0)::numeric))
);
ALTER TABLE public.nft_collection ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nft_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
CREATE TABLE public.whitelist_entry (
    nft_collection_id integer,
    email public.citext,
    customer_name character varying,
    customer_id integer,
    whitelisted_amount integer
);
ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_account_email_key UNIQUE (account_email);
ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_brand_name_key UNIQUE (brand_name);
ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_ecomm_backend_id_key UNIQUE (ecomm_backend_id);
ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_magic_address_key UNIQUE (magic_address);
ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_email_key UNIQUE (email);
ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_external_address_key UNIQUE (external_address);
ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_magic_address_key UNIQUE (magic_address);
ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_phone_number_key UNIQUE (phone_number);
ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.nft_collection
    ADD CONSTRAINT nft_collection_contract_address_key UNIQUE (contract_address);
ALTER TABLE ONLY public.nft_collection
    ADD CONSTRAINT nft_collection_pkey PRIMARY KEY (id);
CREATE UNIQUE INDEX brand_lower_idx ON public.brand USING btree (lower((brand_name)::text));
CREATE UNIQUE INDEX customer_lower_idx ON public.customer USING btree (lower((external_address)::text));
CREATE UNIQUE INDEX customer_lower_idx1 ON public.customer USING btree (lower((email)::text));
CREATE UNIQUE INDEX nft_collection_contract_address_idx ON public.nft_collection USING btree (contract_address);
CREATE UNIQUE INDEX nft_collection_title_idx ON public.nft_collection USING btree (title);
CREATE UNIQUE INDEX whitelist_entry_email_idx ON public.whitelist_entry USING btree (email);
CREATE UNIQUE INDEX whitelist_entry_nft_collection_id_idx ON public.whitelist_entry USING btree (nft_collection_id);
ALTER TABLE ONLY public.nft_collection
    ADD CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES public.brand(id);
ALTER TABLE ONLY public.whitelist_entry
    ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES public.customer(id);
ALTER TABLE ONLY public.whitelist_entry
    ADD CONSTRAINT fk_nft_collection FOREIGN KEY (nft_collection_id) REFERENCES public.nft_collection(id);
