insert into public."deposit_programs"("id", "name", "type", "validThroughMin", "validThroughMax", "currency", "percent", "createdAt", "updatedAt") values
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Revocable', 'urgent_revocable', 7, null, 'BYN', 6.9, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Revocable', 'urgent_revocable', 7, null, 'USD', 1.2, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Revocable', 'urgent_revocable', 7, null, 'EUR', 0.5, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Revocable', 'urgent_revocable', 7, null, 'RUB', 3.5, clock_timestamp(), clock_timestamp()),

(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'BYN', 8.0, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'USD', 1.5, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'EUR', 0.7, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'RUB', 3.75, clock_timestamp(), clock_timestamp()),

(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'BYN', 9.2, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'USD', 1.7, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'EUR', 1.0, clock_timestamp(), clock_timestamp()),
(md5(random()::text || clock_timestamp()::text)::uuid, 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'RUB', 4.0, clock_timestamp(), clock_timestamp());