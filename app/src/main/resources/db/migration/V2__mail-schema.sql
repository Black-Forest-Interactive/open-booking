-- mail_job
CREATE SEQUENCE mail_job_seq;
CREATE TABLE mail_job
(
    id      BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('mail_job_seq'::regclass),
    status  VARCHAR(255)                NOT NULL,
    title   TEXT                        NOT NULL,

    created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE
);


-- mail_job_content
CREATE SEQUENCE mail_job_content_seq;
CREATE TABLE mail_job_content
(
    id        BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('mail_job_content_seq'::regclass),
    mail_json TEXT   NOT NULL,
    from_json TEXT   NOT NULL,
    to_json   TEXT   NOT NULL,
    bcc_json  TEXT   NOT NULL,

    job_id    BIGINT NOT NULL UNIQUE,

    CONSTRAINT fk_mail_job_content FOREIGN KEY (job_id) REFERENCES mail_job (id)
);

-- mail_job_history
CREATE SEQUENCE mail_job_history_seq;
CREATE TABLE mail_job_history
(
    id        BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('mail_job_history_seq'::regclass),
    message   TEXT                        NOT NULL,
    timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,

    job_id    BIGINT                      NOT NULL,

    CONSTRAINT fk_mail_job_history FOREIGN KEY (job_id) REFERENCES mail_job (id)
);
