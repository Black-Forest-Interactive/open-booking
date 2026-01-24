-- guide
CREATE SEQUENCE guide_seq;
CREATE TABLE guide
(
    id         BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('guide_seq'::regclass),
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    mobile     VARCHAR(255) NOT NULL,
    phone      VARCHAR(255) NOT NULL,
    created    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated    TIMESTAMP WITHOUT TIME ZONE
);

-- visitor
CREATE SEQUENCE visitor_seq;
CREATE TABLE visitor
(
    id                  BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('visitor_seq'::regclass),
    type                VARCHAR(255) NOT NUll,

    title               VARCHAR(255) NOT NULL,
    description         VARCHAR(255) NOT NULL,

    size                INT          NOT NULL,
    min_age             INT          NOT NULL,
    max_age             INT          NOT NULL,

    name                VARCHAR(255) NOT NULL,
    street              VARCHAR(255) NOT NULL,
    city                VARCHAR(255) NOT NULL,
    zip                 VARCHAR(20)  NOT NULL,

    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(255) NOT NULL,

    verification_status VARCHAR(255) NOT NULL,
    verified_at         TIMESTAMP WITHOUT TIME ZONE,

    created             TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated             TIMESTAMP WITHOUT TIME ZONE
);

-- label
CREATE SEQUENCE label_seq;
CREATE TABLE label
(
    id       BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('label_seq'::regclass),
    name     VARCHAR(255) NOT NULL,
    color    VARCHAR(255) NOT NULL UNIQUE,
    priority INT          NOT NULL,

    created  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated  TIMESTAMP WITHOUT TIME ZONE
);

-- offer
CREATE SEQUENCE offer_seq;
CREATE TABLE offer
(
    id          BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('offer_seq'::regclass),
    start       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    finish      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    max_persons INT    NOT NULL,
    active      BOOL   NOT NULL,

    label_id    BIGINT REFERENCES label (id),
    guide_id    BIGINT REFERENCES guide (id),

    created     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated     TIMESTAMP WITHOUT TIME ZONE
);

-- booking
CREATE SEQUENCE booking_seq;
CREATE TABLE booking
(
    id         BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('booking_seq'::regclass),
    key        VARCHAR(255) NOT NULL,
    status     VARCHAR(255) NOT NULL,
    size       INT          NOT NULL,
    comment    TEXT         NOT NULL,
    lang       VARCHAR(10)  NOT NULL,

    offer_id   BIGINT       NOT NULL REFERENCES offer (id),
    visitor_id BIGINT       NOT NULL REFERENCES visitor (id),

    created    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated    TIMESTAMP WITHOUT TIME ZONE
);

-- response
CREATE SEQUENCE response_seq;
CREATE TABLE response
(
    id      BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('response_seq'::regclass),
    lang    VARCHAR(255) NOT NULL,
    type    VARCHAR(255) NOT NULL,
    title   VARCHAR(255) NOT NULL,
    content TEXT         NOT NULL,

    created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE
);

-- notification
CREATE SEQUENCE notification_template_seq;
CREATE TABLE notification_template
(
    id           BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('notification_template_seq'::regclass),
    lang         VARCHAR(255) NOT NULL,
    type         VARCHAR(255) NOT NULL,
    subject      VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,

    created      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated      TIMESTAMP WITHOUT TIME ZONE
);

-- audit
CREATE SEQUENCE audit_log_entry_seq;
CREATE TABLE audit_log_entry
(
    id           BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('audit_log_entry_seq'::regclass),
    timestamp    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    actor        VARCHAR(255) NOT NULL,
    level        VARCHAR(255) NOT NULL,
    message      TEXT         NOT NULL,
    reference_id VARCHAR(255) NOT NULL,
    reference    TEXT         NOT NULL,
    source       VARCHAR(255) NOT NULL,

    created    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated    TIMESTAMP WITHOUT TIME ZONE
);

-- setting
CREATE SEQUENCE setting_seq;
CREATE TABLE setting
(
    id      BIGINT       NOT NULL PRIMARY KEY DEFAULT nextval('setting_seq'::regclass),
    key     VARCHAR(255) NOT NULL UNIQUE,
    value   TEXT         NOT NULL,
    type    VARCHAR(255) NOT NULL,

    created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE
);

-- default settings
INSERT INTO setting(key, value, type, created)
VALUES ('url.help', 'http://localhost', 'URL', now());

INSERT INTO setting(key, value, type, created)
VALUES ('url.terms-and-conditions', 'http://localhost', 'URL', now());

INSERT INTO setting(key, value, type, created)
VALUES ('mail.from-address', 'mail@test.com', 'EMAIL', now());

INSERT INTO setting(key, value, type, created)
VALUES ('mail.reply-to-address', 'mail@test.com', 'EMAIL', now());

INSERT INTO setting(key, value, type, created)
VALUES ('mail.default-admin-address', 'mail@test.com', 'EMAIL', now());

INSERT INTO setting(key, value, type, created)
VALUES ('text.title', 'APP.Title', 'STRING', now());
