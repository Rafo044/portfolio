# Banksphere

![Cover Image](../assets/images/projects/banksphere/pipline.png)


## Data  Pipline

![Pipline](../assets/images/projects/banksphere/pipline.png)




## Table informations

```markdown

  | csv fayl        | Temp table adı | Description                                             |
| ------------------------- | -------------- | ------------------------------------------------------- |
| Accounts.csv          | accounts       | Bütün bank hesablarının məlumatları                     |
| AccountStatus.csv     | accstatus      | Hesabların aktiv, bloklanmış və ya digər statusları     |
| AccountTypes.csv      | acctypes       | Hesab növlərinin siyahısı (məs: checking, savings)      |
| Addresses.csv         | address        | Müştəri və ya filial ünvanlarının məlumatları           |
| AddressTypes.csv      | addrestypes    | Ünvan növləri (məs: ev, iş, poçt)                       |
| Branches.csv          | branches       | Bank filialları və onların atributları                  |
| Customers.csv         | customers      | Müştəri məlumatları (ad, soyad, qeydiyyat və s.)        |
| CustomerTypes.csv     | customtypes    | Müştəri növləri (məs: fərdi, korporativ)                |
| EmployeePositions.csv | emposition     | İşçilərin vəzifə və mövqeləri                           |
| Employees.csv         | employee       | İşçilərin məlumatları (ad, soyad, vəzifə, filial)       |
| LoanPayments.csv      | loanpayments   | Kredit ödənişlərinin detalları                          |
| Loans.csv             | loans          | Kreditlərin əsas məlumatları (məbləğ, faiz, müddət)     |
| LoanStatus.csv        | loanstatus     | Kreditlərin statusları (aktiv, ödənmiş, gecikmiş və s.) |

```



Operational metadata

| Field             | İzah                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| `file_name`       | Fayl adı (eyni audit ilə)                                              |
| `ingest_time`     | Fayl ingest zamanı                                                     |
| `row_count`       | Fayldakı sətir sayı                                                    |
| `checksum`        | Fayl hash-i (integrity check)                                          |
| `source`          | Mənbə layer (`bronze`)                                                 |
| `status`          | Ingest statusu (success / failed)                                      |
| `error_count`     | Faylda tapılan validation errors sayı                                  |
| `null_rate`       | Hər əsas sütunun null dəyərlərinin faizi                               |
| `duplicate_count` | Fayldakı duplicate rows sayı                                           |
| `schema_match`    | Faylın schema-sının gözlənilən schema ilə uyğunluğu (`true` / `false`) |
| `orphan_records`  | Referenced lookup-larda tapılan orphan rows sayı                       |
| `validated`       | Basic validation tamamlanıb tamamlanmadığı (`true` / `false`)          |





Audit log metadata
| Field           | İzah                                                              |
| --------------- | ----------------------------------------------------------------- |
| `file_name`     | Oxunan Parquet faylının tam yolu (`s3://bronze/Accounts.parquet`) |
| `ingest_time`   | Faylın ingest olunduğu timestamp                                  |
| `row_count`     | Fayldakı sətir sayı                                               |
| `checksum`      | Faylın hash-i (SHA256 və ya CRC32) → data integrity yoxlamaq üçün |
| `source`        | Faylın mənbəyi (`bronze`)                                         |
| `status`        | Ingest uğurlu olub-olmaması (`success` / `failed`)                |
| `error_message` | Fayl oxunarkən və ya parse zamanı çıxan error mesajı (əgər varsa) |
