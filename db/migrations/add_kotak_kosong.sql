-- Migration: Add Kotak Kosong candidates for Kahim and Senator positions
-- This ensures the empty box option appears in voting results
-- Insert Kotak Kosong for Kahim position (if not exists)
INSERT INTO candidates (
        id,
        name,
        photo_url,
        major,
        batch,
        vision,
        mission,
        hashtag,
        position,
        created_at
    )
VALUES (
        'KOTAK_KOSONG_KAHIM',
        'Kotak Kosong',
        '/logos/pemilu logo fix.png',
        '',
        0,
        'Tidak memilih kandidat manapun untuk posisi Ketua Umum',
        'Tidak memilih kandidat manapun untuk posisi Ketua Umum',
        NULL,
        'kahim',
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
-- Insert Kotak Kosong for Senator position (if not exists)
INSERT INTO candidates (
        id,
        name,
        photo_url,
        major,
        batch,
        vision,
        mission,
        hashtag,
        position,
        created_at
    )
VALUES (
        'KOTAK_KOSONG_SENATOR',
        'Kotak Kosong',
        '/logos/pemilu logo fix.png',
        '',
        0,
        'Tidak memilih kandidat manapun untuk posisi Senator',
        'Tidak memilih kandidat manapun untuk posisi Senator',
        NULL,
        'senator',
        NOW()
    ) ON CONFLICT (id) DO NOTHING;