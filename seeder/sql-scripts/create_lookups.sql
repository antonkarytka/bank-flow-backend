insert into cities(id, name, "createdAt", "updatedAt") values
(uuid('f36562cb-b583-e545-c85d-7148b0c09a3a'), 'Brest', clock_timestamp(), clock_timestamp()),
(uuid('b71ca31b-6a9d-c8a3-5664-ff60eda94f9b'), 'Vitebsk', clock_timestamp(), clock_timestamp()),
(uuid('32821260-7edd-c9da-92ce-a3c19ccd2d3d'), 'Mogilev', clock_timestamp(), clock_timestamp()),
(uuid('b3950bb0-15a6-1caf-7410-a40e7277a4cc'), 'Grodno', clock_timestamp(), clock_timestamp()),
(uuid('1d11215a-f034-7f19-04fa-fb025324de17'), 'Gomel', clock_timestamp(), clock_timestamp()),
(uuid('0e39a2ff-663d-ba85-3bf5-9538896fa8ca'), 'Minsk', clock_timestamp(), clock_timestamp());

insert into citizenships(id, name, "createdAt", "updatedAt") values
(uuid('c0abea43-35c9-7c52-05ec-8f74e6674b0e'), 'Belarus', clock_timestamp(), clock_timestamp()),
(uuid('28affb2d-5dd1-50ed-69d0-6dfcda7b672f'), 'Russia', clock_timestamp(), clock_timestamp());

insert into disabilities(id, grade, "createdAt", "updatedAt") values
(uuid('c10f7550-d0d1-58ee-093d-a14aad9afef7'), 1, clock_timestamp(), clock_timestamp()),
(uuid('b19d0ec0-6450-9553-c74c-9a057662994f'), 2, clock_timestamp(), clock_timestamp()),
(uuid('9ce5afa7-57ae-655c-547a-999d7ec92c65'), 3, clock_timestamp(), clock_timestamp());

insert into public."deposit_programs"("id", "name", "type", "validThroughMin", "validThroughMax", "currency", "percent", "createdAt", "updatedAt") values
(uuid('3199a5fe-aab1-02cf-5ced-4ce9ba4f17af'), 'Urgent Revocable', 'urgent_revocable', 7, null, 'BYN', 6.9, clock_timestamp(), clock_timestamp()),
(uuid('3dab41e4-25fc-c502-0994-1aafa94c023c'), 'Urgent Revocable', 'urgent_revocable', 7, null, 'USD', 1.2, clock_timestamp(), clock_timestamp()),
(uuid('4892988e-69f4-6ced-f21f-7ed1d989cd6e'), 'Urgent Revocable', 'urgent_revocable', 7, null, 'EUR', 0.5, clock_timestamp(), clock_timestamp()),
(uuid('88b8ea9c-cc65-12cd-6b41-c25904debb6a'), 'Urgent Revocable', 'urgent_revocable', 7, null, 'RUB', 3.5, clock_timestamp(), clock_timestamp()),

(uuid('5551d682-4018-9080-f63b-765f1fd7b69c'), 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'BYN', 8.0, clock_timestamp(), clock_timestamp()),
(uuid('9c8df7f8-c160-c9f3-b99a-62ab1004b48d'), 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'USD', 1.5, clock_timestamp(), clock_timestamp()),
(uuid('cf8fd679-68ff-2a54-5e4a-b2a0b74867c1'), 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'EUR', 0.7, clock_timestamp(), clock_timestamp()),
(uuid('06b1eb7f-9ad2-b0ee-b57e-b4db70f19725'), 'Urgent Irrevocable', 'urgent_irrevocable', 32, 186,'RUB', 3.75, clock_timestamp(), clock_timestamp()),

(uuid('dc40e4d7-14a9-ae05-aa75-dfe80c57a024'), 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'BYN', 9.2, clock_timestamp(), clock_timestamp()),
(uuid('2613d408-aa6a-3656-7c3b-ca9fc85691b6'), 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'USD', 1.7, clock_timestamp(), clock_timestamp()),
(uuid('34c4d005-79b8-42c5-10e0-a2f7eb40aeb2'), 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'EUR', 1.0, clock_timestamp(), clock_timestamp()),
(uuid('87adcc30-ba34-7754-245e-fcb497eec034'), 'Urgent Irrevocable', 'urgent_irrevocable', 187, null, 'RUB', 4.0, clock_timestamp(), clock_timestamp());

insert into bank_accounts(id, "number", "numberCode", activity, debit, credit, remainder, name, amount, "accountType", "createdAt", "updatedAt") values
(uuid('fb2379af-781c-4fd6-b105-8f40997c9aeb'), '266529598564', 3012, 'active', 0, 0, 0, 'BankGrowth', 0, 'bank_growth', CURRENT_DATE, CURRENT_DATE),
(uuid('35fbbf80-10b5-4743-bae3-5a7cd3a0312f'), '266529598565', 3012, 'active', 0, 0, 0, 'Cashbox', 0, 'cashbox', CURRENT_DATE, CURRENT_DATE);