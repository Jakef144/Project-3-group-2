CREATE TABLE top_10 (
  "Area_Type" VARCHAR NOT NULL,
  "Area_Name" VARCHAR NOT NULL,
  "Year" int NOT NULL,
  "Time_Period" VARCHAR NOT NULL,
  "Ownership" VARCHAR NOT NULL,
  "NAICS_Level" int NOT NULL,
  "NAICS_Code" varchar NOT NULL,
  "Industry_Name" VARCHAR NOT NULL,
  "Establishments" int NOT NULL,
  "Average_Monthly_Employment" int NOT NULL,
  "1st_Month_Emp" int NOT NULL,
  "2nd_Month_Emp" int NOT NULL,
  "3rd_Month_Emp" int NOT NULL,
  "Total_Wages" bigint NOT NULL,
  "Average_Weekly_Wages" int NOT NULL
);

CREATE TABLE projections_2025 (
  "area_type" VARCHAR NOT NULL,
  "area_name" VARCHAR NOT NULL,
  "period" VARCHAR NOT NULL,
  "series_code" bigint NOT NULL,
  "industry_title" VARCHAR NOT NULL,
  "base_quarter_employment_estimate" bigint NOT NULL,
  "projected_quarter_employment_estimate" bigint NOT NULL,
  "numeric_change" int NOT NULL,
  "percentage_change" float NOT NULL,
  "industry_category" VARCHAR NOT NULL
);

CREATE TABLE projections_2030 (
  "area_type" VARCHAR NOT NULL,
  "area_name" VARCHAR NOT NULL,
  "county" VARCHAR,
  "time_period" VARCHAR NOT NULL,
  "occupational_title" VARCHAR NOT NULL,
  "base_year_employment_estimate" int NOT NULL,
  "projected_year_employment_estimate" int NOT NULL,
  "numeric_change" int NOT NULL,
  "percent_change" float NOT NULL,
  "exits" int NOT NULL,
  "transfers" int NOT NULL,
  "total_job_openings" int NOT NULL,
  "median_hourly_wage" float NOT NULL,
  "median_annual_wage" bigint NOT NULL,
  "entry_level_education" VARCHAR,
  "work_experience" VARCHAR,
  "job_training" VARCHAR
);