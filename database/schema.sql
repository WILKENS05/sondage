-- Schema Neon pour le sondage "Avis du peuple haitien"

CREATE TABLE responses (
  id           SERIAL PRIMARY KEY,
  reponse_1    TEXT NOT NULL,
  reponse_2    TEXT NOT NULL,
  reponse_3    TEXT NOT NULL,
  pays         TEXT,
  langue       TEXT NOT NULL DEFAULT 'fr' CHECK (langue IN ('fr', 'ht', 'en')),
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_responses_created_at ON responses(created_at);
