-- staff
CREATE SEQUENCE staff_member_seq;
CREATE TABLE staff_member
(
    id         BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('staff_member_seq'::regclass),
    first_name VARCHAR(255)                NOT NULL,
    last_name  VARCHAR(255)                NOT NULL,
    email      VARCHAR(255)                NOT NULL,
    mobile     VARCHAR(255)                NOT NULL,
    phone      VARCHAR(255)                NOT NULL,
    created    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated    TIMESTAMP WITHOUT TIME ZONE
);
-- role
CREATE SEQUENCE tour_role_seq;
CREATE TABLE tour_role
(
    id          BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('tour_role_seq'::regclass),
    name        VARCHAR(255)                NOT NULL,
    description TEXT                        NOT NULL,
    created     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated     TIMESTAMP WITHOUT TIME ZONE
);


-- visitor
CREATE SEQUENCE visitor_group_seq;
CREATE TABLE visitor_group
(
    id       BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('visitor_group_seq'::regclass),
    title    VARCHAR(255)                NOT NULL,
    size     INT                         NOT NULL,
    is_group BOOLEAN                     NOT NULL,
    min_age  INT                         NOT NULL,
    max_age  INT                         NOT NULL,
    contact  VARCHAR(255)                NOT NULL,
    street   VARCHAR(255)                NOT NULL,
    city     VARCHAR(255)                NOT NULL,
    zip      VARCHAR(20)                 NOT NULL,
    email    VARCHAR(255)                NOT NULL,
    phone    VARCHAR(255)                NOT NULL,
    status   VARCHAR(255)                NOT NULL,

    created  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated  TIMESTAMP WITHOUT TIME ZONE
);

-- offer
CREATE SEQUENCE offer_seq;
CREATE TABLE offer
(
    id          BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('offer_seq'::regclass),
    start       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    finish      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    max_persons INT                         NOT NULL,
    active      BOOL                        NOT NULL,

    created     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated     TIMESTAMP WITHOUT TIME ZONE
);

-- booking
CREATE SEQUENCE booking_seq;
CREATE TABLE booking
(
    id               BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('booking_seq'::regclass),
    status           VARCHAR(255)                NOT NULL,
    size             INT                         NOT NULL,

    offer_id         BIGINT                      NOT NULL,
    visitor_group_id BIGINT                      NOT NULL,

    created          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated          TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_booking_offer FOREIGN KEY (offer_id) REFERENCES offer (id)
);

-- booking request
CREATE SEQUENCE booking_request_seq;
CREATE TABLE booking_request
(
    id               BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('booking_request_seq'::regclass),
    key              VARCHAR(255)                NOT NULL,
    status           VARCHAR(255)                NOT NULL,
    comment          TEXT                        NOT NULL,

    visitor_group_id BIGINT                      NOT NULL,

    created          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated          TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE booking_request_booking
(
    booking_request_id BIGINT NOT NULL,
    booking_id         BIGINT NOT NULL,

    CONSTRAINT fk_relation_booking_request FOREIGN KEY (booking_request_id) REFERENCES booking_request (id),
    CONSTRAINT fk_relation_booking FOREIGN KEY (booking_id) REFERENCES booking (id)
);

-- tour
CREATE SEQUENCE tour_seq;
CREATE TABLE tour
(
    id       BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('tour_seq'::regclass),
    creator  VARCHAR(255)                NOT NULL,

    offer_id BIGINT                      NOT NULL,

    created  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated  TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_tour_offer FOREIGN KEY (offer_id) REFERENCES offer (id)
);

CREATE TABLE tour_staff_member
(
    tour_id         BIGINT NOT NULL,
    staff_member_id BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,
    CONSTRAINT fk_relation_member_tour FOREIGN KEY (tour_id) REFERENCES tour (id),
    CONSTRAINT fk_relation_member_staff_member FOREIGN KEY (tour_id) REFERENCES staff_member (id),
    CONSTRAINT fk_relation_member_role FOREIGN KEY (role_id) REFERENCES tour_role (id)
);

CREATE TABLE tour_booking
(
    tour_id    BIGINT NOT NULL,
    booking_id BIGINT NOT NULL,

    CONSTRAINT fk_relation_tour_tour FOREIGN KEY (tour_id) REFERENCES tour (id),
    CONSTRAINT fk_relation_tour_booking FOREIGN KEY (booking_id) REFERENCES booking (id)
);

-- response
CREATE SEQUENCE response_seq;
CREATE TABLE response
(
    id      BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('response_seq'::regclass),
    lang    VARCHAR(255)                NOT NULL,
    type    VARCHAR(255)                NOT NULL,
    title   VARCHAR(255)                NOT NULL,
    content TEXT                        NOT NULL,

    created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE
);

-- notification
CREATE SEQUENCE notification_template_seq;
CREATE TABLE notification_template
(
    id           BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('notification_template_seq'::regclass),
    lang         VARCHAR(255)                NOT NULL,
    type         VARCHAR(255)                NOT NULL,
    subject      VARCHAR(255)                NOT NULL,
    content_type VARCHAR(255)                NOT NULL,
    content      TEXT                        NOT NULL,

    created      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated      TIMESTAMP WITHOUT TIME ZONE
);

-- audit
CREATE SEQUENCE audit_log_entry_seq;
CREATE TABLE audit_log_entry
(
    id           BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('audit_log_entry_seq'::regclass),
    timestamp    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    actor        VARCHAR(255)                NOT NULL,
    level        VARCHAR(255)                NOT NULL,
    message      TEXT                        NOT NULL,
    reference_id VARCHAR(255)                NOT NULL,
    reference    TEXT                        NOT NULL,
    source       VARCHAR(255)                NOT NULL
);

-- setting
CREATE SEQUENCE setting_seq;
CREATE TABLE setting
(
    id      BIGINT                      NOT NULL PRIMARY KEY DEFAULT nextval('setting_seq'::regclass),
    key     VARCHAR(255)                NOT NULL UNIQUE,
    value   TEXT                        NOT NULL,
    type    VARCHAR(255)                NOT NULL,

    created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE
);

-- default settings
INSERT INTO setting(key, value, type,created)
VALUES ('url.help', 'http://localhost', 'URL', now());

INSERT INTO setting(key, value, type,created)
VALUES ('url.terms-and-conditions', 'http://localhost', 'URL', now());

INSERT INTO setting(key, value, type,created)
VALUES ('mail.from-address', 'mail@test.com', 'EMAIL', now());

INSERT INTO setting(key, value, type,created)
VALUES ('mail.reply-to-address', 'mail@test.com', 'EMAIL', now());

INSERT INTO setting(key, value, type,created)
VALUES ('mail.default-admin-address', 'mail@test.com', 'EMAIL', now());

INSERT INTO setting(key, value, type,created)
VALUES ('text.title', 'APP.Title', 'STRING', now());
