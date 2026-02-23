# HR Excel Data – Admin Dashboard

Yahan **Savra_Teacher Data Set.xlsx** (jo HR ne bheja hai) copy karo. Isi file se dashboard par teacher data load hoga.

## Steps

1. **Excel file copy karo**  
   `C:\Users\hp\Downloads\Savra_Teacher Data Set.xlsx` ko is folder mein copy karo:
   ```
   f:\School-admin-details\data\Savra_Teacher Data Set.xlsx
   ```

2. **Server restart karo**  
   `npm run dev` band karke dubara chalao. Dashboard ab Excel wala data dikhayega.

## Expected columns (Excel mein)

- `teacher_id` (ya Teacher ID)
- `teacher_name` (ya Teacher Name / Name)
- `activity_type` (lesson / quiz / assessment)
- `created_at` (ya Date)
- `subject`
- `class` (ya Class Taught)

Agar column names thode alag hain to bhi code common names se map kar leta hai. File nahi rahegi to dummy data use hoga.
