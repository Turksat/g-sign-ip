package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationFilterRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage3RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage7RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationFilterResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationStatusResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationSummaryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.PatentSearchResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PatentSearchRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Application;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.UserApplication;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Array;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Repository
public class JdbcApplicationRepository implements ApplicationRepository {
    private JdbcTemplate jdbcTemplate;

    public JdbcApplicationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Application> getAllApplications() {
        return List.of();
    }

    @Override
    public Application getApplicationByApplicationNo(String applicationNo) {
        String sql = "SELECT * FROM gsignip.applications WHERE application_no = ?";

        return jdbcTemplate.queryForObject(sql, new Object[] { applicationNo }, (rs, rowNum) -> {
            Application app = new Application();

            app.setApplicationNo(rs.getString("application_no"));
            app.setNationalityNo(rs.getString("nationality_no"));
            app.setCountryId(rs.getInt("country_id"));
            app.setCiCountryId(rs.getInt("ci_country_id"));
            app.setStateId(rs.getInt("state_id"));
            app.setResidencyTypeId(rs.getInt("residency_type_id"));
            app.setUserId(rs.getInt("user_id"));
            app.setApplicationStatusId(rs.getInt("application_status_id"));
            app.setGenderId(rs.getInt("gender_id"));
            app.setApplicationTypeId(rs.getInt("application_type_id"));
            app.setApplicantEntitlementRate(rs.getBigDecimal("applicant_entitlement_rate"));
            app.setNationalIdNo(rs.getString("national_id_no"));
            app.setPrefix(rs.getString("prefix"));
            app.setSuffix(rs.getString("suffix"));
            app.setBirthDate(rs.getObject("birth_date", LocalDate.class));
            app.setAnonymous(rs.getBoolean("is_anonymous"));
            app.setCity(rs.getString("city"));
            app.setCiStreetAddressOne(rs.getString("ci_street_address_one"));
            app.setCiStreetAddressTwo(rs.getString("ci_street_address_two"));
            app.setCiCity(rs.getString("ci_city"));
            app.setCiPostalCode(rs.getString("ci_postal_code"));
            app.setTitleOfInvention(rs.getString("title_of_invention"));
            app.setInventionSummary(rs.getString("invention_summary"));
            app.setGeographicalOrigin(rs.getBoolean("is_geographical_origin"));
            app.setGovernmentFunded(rs.getBoolean("is_government_funded"));
            app.setAIA(rs.getBoolean("is_aia"));
            app.setAuthorizedToPDX(rs.getBoolean("is_authorized_to_pdx"));
            app.setAuthorizedToEPO(rs.getBoolean("is_authorized_to_epo"));
            app.setSignature(rs.getString("signature"));
            app.setLikelihood(rs.getBigDecimal("likelihood"));
            app.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
            app.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));

            // 🧠 Extract int[] and convert to List<Integer>
            Array array = rs.getArray("patent_classification_id");
            if (array != null) {
                Integer[] intArray = (Integer[]) array.getArray();
                app.setPatentClassificationId(Arrays.asList(intArray));
            }

            return app;
        });
    }

    // i need to ask about how the application no will be generated.
    @Override
    public void createApplication(Application application) {
        String sql = """
                    INSERT INTO gsignip.applications (
                        user_id,
                        application_status_id,
                        application_no,
                        /* below here are dto fields */
                        applicant_entitlement_rate,
                        nationality_no,
                        national_id_no,
                        prefix,
                        suffix,
                        birth_date,
                        gender_id,
                        residency_type_id,
                        state_id,
                        city,
                        country_id,
                        ci_country_id,
                        ci_street_address_one,
                        ci_street_address_two,
                        ci_city,
                        ci_postal_code,
                        is_anonymous,
                        created_at,
                        updated_at
                    ) VALUES (  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                application.getUserId(),
                application.getApplicationStatusId(),
                application.getApplicationNo(),
                application.getApplicantEntitlementRate(),
                application.getNationalityNo(),
                application.getNationalIdNo(),
                application.getPrefix(),
                application.getSuffix(),
                application.getBirthDate(),
                application.getGenderId(),
                application.getResidencyTypeId(),
                application.getStateId(),
                application.getCity(),
                application.getCountryId(),
                application.getCiCountryId(),
                application.getCiStreetAddressOne(),
                application.getCiStreetAddressTwo(),
                application.getCiCity(),
                application.getCiPostalCode(),
                application.isAnonymous(),
                application.getCreatedAt(),
                application.getUpdatedAt());
    }

    @Override
    public void updateApplicationStage1(String applicationNo, Application application) {
        String sql = """
                    UPDATE gsignip.applications
                    SET applicant_entitlement_rate = ?,
                        nationality_no = ?,
                        national_id_no = ?,
                        prefix = ?,
                        suffix = ?,
                        birth_date = ?,
                        gender_id = ?,
                        residency_type_id = ?,
                        state_id = ?,
                        city = ?,
                        country_id = ?,
                        ci_country_id = ?,
                        ci_street_address_one = ?,
                        ci_street_address_two = ?,
                        ci_city = ?,
                        ci_postal_code = ?,
                        is_anonymous = ?,
                        updated_at = ?
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql,
                application.getApplicantEntitlementRate(),
                application.getNationalityNo(),
                application.getNationalIdNo(),
                application.getPrefix(),
                application.getSuffix(),
                application.getBirthDate(),
                application.getGenderId(),
                application.getResidencyTypeId(),
                application.getStateId(),
                application.getCity(),
                application.getCountryId(),
                application.getCiCountryId(),
                application.getCiStreetAddressOne(),
                application.getCiStreetAddressTwo(),
                application.getCiCity(),
                application.getCiPostalCode(),
                application.isAnonymous(),
                application.getUpdatedAt(),
                applicationNo);
    }

    @Override
    public void updateApplicationStage2(String applicationNo, Application application) {
        String sql = """
                    UPDATE gsignip.applications
                    SET application_type_id = ?,
                        title_of_invention = ?,
                        invention_summary = ?,
                        patent_classification_id = ?,
                        is_geographical_origin = ?,
                        is_government_funded = ?
                    WHERE application_no = ?
                """;

        try (
                Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
            // 💡 Convert List<Integer> to Integer[] — needed for createArrayOf
            Integer[] intArray = application.getPatentClassificationId().toArray(new Integer[0]);

            // 🔥 Create a PostgreSQL integer[] array
            Array sqlArray = conn.createArrayOf("integer", intArray);

            // ✅ Use classic jdbcTemplate.update(...) with the SQL array
            jdbcTemplate.update(sql,
                    application.getApplicationTypeId(),
                    application.getTitleOfInvention(),
                    application.getInventionSummary(),
                    sqlArray,
                    application.isGeographicalOrigin(),
                    application.isGovernmentFunded(),
                    applicationNo);
        } catch (SQLException e) {
            throw new RuntimeException("Database error during stage 2 update", e);
        }
    }

    @Override
    public void deleteApplication(int ApplicationNo) {

    }

    @Override
    public void updateApplicationStage3(String applicationNo,
            ApplicationUpdateStage3RequestDTO applicationUpdateStage3RequestDTO) {
        String sql = """
                    UPDATE gsignip.applications
                    SET likelihood = ?
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql,
                applicationUpdateStage3RequestDTO.getLikelihood(),
                applicationNo);

        // Step 2: Insert all documents with base64 to byte array conversion
        List<ApplicationDocument> allDocuments = new ArrayList<>();
        allDocuments.addAll(applicationUpdateStage3RequestDTO.getClaims());
        allDocuments.addAll(applicationUpdateStage3RequestDTO.getAbstractOfTheDisclosures());
        allDocuments.addAll(applicationUpdateStage3RequestDTO.getDrawings());
        allDocuments.addAll(applicationUpdateStage3RequestDTO.getSupportingDocuments());

        for (ApplicationDocument doc : allDocuments) {
            // Base64'ten byte array'e çevir
            byte[] fileBytes = null;
            if (doc.getFile() != null && doc.getFile().length > 0) {
                // Eğer zaten byte array ise direkt kullan
                fileBytes = doc.getFile();
            } else if (doc.getFileContent() != null && !doc.getFileContent().isEmpty()) {
                // Eğer base64 string ise çevir
                try {
                    fileBytes = java.util.Base64.getDecoder().decode(doc.getFileContent());
                } catch (IllegalArgumentException e) {
                    // Base64 decode hatası durumunda log
                    System.err.println("Base64 decode error for file: " + doc.getFileName());
                }
            }

            // File content'i güncelle
            if (fileBytes != null) {
                doc.setFile(fileBytes);
            }

            // Document'ı kaydet
            insertDocument(applicationNo, doc);
        }
    }

    @Override
    public void updateApplicationStage4(String applicationNo, boolean isAIA) {
        String sql = """
                    UPDATE gsignip.applications
                    SET is_aia = ?
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql,
                isAIA,
                applicationNo);
    }

    @Override
    public void updateApplicationStage5(String applicationNo, boolean isAuthorizedToPdx, boolean isAuthorizedToEpo) {
        String sql = """
                    UPDATE gsignip.applications
                    SET is_authorized_to_pdx = ?,
                        is_authorized_to_epo = ?
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql,
                isAuthorizedToPdx,
                isAuthorizedToEpo,
                applicationNo);
    }

    @Override
    public ApplicationSummaryResponseDTO getApplicationSummary(String applicationNo) {

        String sql = """
                SELECT a.application_no,
                       u.first_name,
                       u.middle_name,
                       u.last_name,
                       c.country_name,
                       a.nationality_no,
                       a.birth_date,
                       a.national_id_no,
                       g.gender_name,
                       a.gender_id,
                       a.applicant_entitlement_rate,
                       a.likelihood,
                       u.email,
                       ca.country_code,
                       u.phone_number,
                       rt.residency_type_name,
                       a.residency_type_id,
                       s.state_name,
                       a.state_id,
                       cb.country_name            as country_of_residence,
                       a.country_id               as country_of_residence_id,
                       a.city,
                       cc.country_name            as ci_country_name,
                       a.ci_country_id,
                       a.ci_city,
                       a.ci_street_address_one,
                       a.ci_street_address_two,
                       a.ci_postal_code,
                       a.is_anonymous,
                       at.application_type_name,
                       a.application_type_id,
                       a.title_of_invention,
                       a.invention_summary,
                       ARRAY(
                           SELECT pc.name
                           FROM unnest(a.patent_classification_id) AS pci
                           JOIN gsignip.patent_classifications pc ON pc.patent_classification_id = pci
                       ) AS classification_names,
                       a.patent_classification_id as classification_ids,
                       a.is_geographical_origin,
                       a.is_government_funded,
                       a.is_aia,
                       a.is_authorized_to_pdx,
                       a.is_authorized_to_epo,
                       a.prefix,
                       a.suffix,
                       a.signature
                FROM gsignip.applications a
                         LEFT JOIN gsignip.users u ON a.user_id = u.user_id
                         LEFT JOIN gsignip.countries c ON a.country_id = c.country_id
                         LEFT JOIN gsignip.countries ca ON u.phone_number_country_code_id = ca.country_id
                         LEFT JOIN gsignip.countries cb ON a.country_id = cb.country_id
                         LEFT JOIN gsignip.countries cc ON a.ci_country_id = cc.country_id
                         LEFT JOIN gsignip.genders g ON a.gender_id = g.gender_id
                         LEFT JOIN gsignip.residency_types rt ON a.residency_type_id = rt.residency_type_id
                         LEFT JOIN gsignip.states s ON a.state_id = s.state_id
                         LEFT JOIN gsignip.application_types at ON a.application_type_id = at.application_type_id
                WHERE a.application_no = ?
                """;

        return jdbcTemplate.queryForObject(sql, new Object[] { applicationNo }, (rs, rowNum) -> {

            ApplicationSummaryResponseDTO dto = new ApplicationSummaryResponseDTO();
            dto.setApplicationNo(rs.getString("application_no"));
            dto.setFirstName(rs.getString("first_name"));
            dto.setMiddleName(rs.getString("middle_name"));
            dto.setLastName(rs.getString("last_name"));
            dto.setCountryName(rs.getString("country_name"));
            dto.setNationalityNo(rs.getString("nationality_no"));
            dto.setBirthDate(rs.getDate("birth_date").toLocalDate());
            dto.setNationalIdNo(rs.getString("national_id_no"));
            dto.setGenderName(rs.getString("gender_name"));
            dto.setGenderId(rs.getInt("gender_id"));
            dto.setApplicantEntitlementRate(rs.getBigDecimal("applicant_entitlement_rate"));
            dto.setLikelihood(rs.getBigDecimal("likelihood"));
            dto.setEmail(rs.getString("email"));
            dto.setCountryCode(rs.getString("country_code"));
            dto.setPhoneNumber(rs.getString("phone_number"));
            dto.setResidencyTypeName(rs.getString("residency_type_name"));
            dto.setResidencyTypeId(rs.getInt("residency_type_id"));
            dto.setStateName(rs.getString("state_name"));
            dto.setStateId(rs.getInt("state_id"));
            dto.setCountryOfResidence(rs.getString("country_of_residence"));
            dto.setCountryOfResidenceId(rs.getInt("country_of_residence_id"));
            dto.setCity(rs.getString("city"));
            dto.setCiCountryName(rs.getString("ci_country_name"));
            dto.setCiCountryId(rs.getInt("ci_country_id"));
            dto.setCiCity(rs.getString("ci_city"));
            dto.setCiStreetAddressOne(rs.getString("ci_street_address_one"));
            dto.setCiStreetAddressTwo(rs.getString("ci_street_address_two"));
            dto.setCiPostalCode(rs.getString("ci_postal_code"));
            dto.setAnonymous(rs.getBoolean("is_anonymous"));
            dto.setApplicationTypeName(rs.getString("application_type_name"));
            dto.setApplicationTypeId(rs.getInt("application_type_id"));
            dto.setTitleOfInvention(rs.getString("title_of_invention"));
            dto.setInventionSummary(rs.getString("invention_summary"));

            Array classificationArray = rs.getArray("classification_names");
            dto.setClassificationNames(Arrays.asList((String[]) classificationArray.getArray()));

            // Classification IDs array'ini de set et
            Array classificationIdsArray = rs.getArray("classification_ids");
            if (classificationIdsArray != null) {
                dto.setClassificationIds(Arrays.asList((Integer[]) classificationIdsArray.getArray()));
            } else {
                dto.setClassificationIds(new ArrayList<>());
            }

            dto.setGeographicalOrigin(rs.getBoolean("is_geographical_origin"));
            dto.setGovernmentFunded(rs.getBoolean("is_government_funded"));
            dto.setAIA(rs.getBoolean("is_aia"));
            dto.setAuthorizedToPdx(rs.getBoolean("is_authorized_to_pdx"));
            dto.setAuthorizedToEpo(rs.getBoolean("is_authorized_to_epo"));
            dto.setPrefix(rs.getString("prefix"));
            dto.setSuffix(rs.getString("suffix"));
            dto.setSignature(rs.getString("signature"));

            return dto;
        });
    }

    @Override
    public List<ApplicationDocument> getApplicationDocumentsByApplicationNo(String applicationNo) {
        String sql = """
                    SELECT
                        application_document_id,
                        application_document_type_id,
                        file,
                        file_extension,
                        file_name
                    FROM gsignip.application_documents
                    WHERE application_no = ?
                """;

        return jdbcTemplate.query(sql, new Object[] { applicationNo }, (rs, rowNum) -> {
            ApplicationDocument doc = new ApplicationDocument();
            doc.setApplicationDocumentId(rs.getInt("application_document_id"));
            doc.setApplicationDocumentTypeId(rs.getInt("application_document_type_id"));
            doc.setFile(rs.getBytes("file"));
            doc.setFileExtension(rs.getString("file_extension"));
            doc.setFileName(rs.getString("file_name"));
            return doc;
        });
    }

    @Override
    public ApplicationDocument getApplicationDocumentById(int documentId) {
        String sql = """
                    SELECT
                        application_document_id,
                        application_document_type_id,
                        file,
                        file_extension,
                        file_name
                    FROM gsignip.application_documents
                    WHERE application_document_id = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { documentId }, (rs, rowNum) -> {
                ApplicationDocument doc = new ApplicationDocument();
                doc.setApplicationDocumentId(rs.getInt("application_document_id"));
                doc.setApplicationDocumentTypeId(rs.getInt("application_document_type_id"));
                doc.setFile(rs.getBytes("file"));
                doc.setFileExtension(rs.getString("file_extension"));
                doc.setFileName(rs.getString("file_name"));
                return doc;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public void updateApplicationStage6(String applicationNo, String signature) {
        String sql = """
                    UPDATE gsignip.applications
                    SET signature = ?
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql, signature, applicationNo);
    }

    @Override
    public void updateApplicationStage7(String applicationNo,
            ApplicationUpdateStage7RequestDTO applicationUpdateStage7RequestDTO) {
        // Payment information will be stored in a separate payment table
        // For now, we'll just update the application status to completed
        String sql = """
                    UPDATE gsignip.applications
                    SET application_status_id = 4
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql, applicationNo);
    }

    @Override
    public List<UserApplication> getApplicationsForUser(int userId) {
        String sql = """
                    SELECT a.application_no,
                           a.title_of_invention,
                           t.application_type_name AS application_type,
                           a.created_at            AS application_date,
                           s.description,
                           s.status_name           AS application_status,
                           a.application_status_id,
                           CONCAT(u.first_name, ' ', u.last_name) AS applicant_name
                    FROM gsignip.applications a
                             LEFT JOIN gsignip.application_types t ON a.application_type_id = t.application_type_id
                             LEFT JOIN gsignip.application_status s ON a.application_status_id = s.application_status_id
                             LEFT JOIN gsignip.users u ON a.user_id = u.user_id
                    WHERE a.user_id = ?
                """;

        return jdbcTemplate.query(sql, new Object[] { userId }, (rs, rowNum) -> {
            UserApplication app = new UserApplication();
            app.setApplicationNo(rs.getString("application_no"));
            app.setTitleOfInvention(rs.getString("title_of_invention"));
            app.setApplicationType(rs.getString("application_type"));
            app.setApplicationDate(rs.getObject("application_date", OffsetDateTime.class));
            app.setDescription(rs.getString("description"));
            app.setApplicationStatus(rs.getString("application_status"));
            app.setApplicationStatusId(rs.getInt("application_status_id"));
            app.setApplicantName(rs.getString("applicant_name"));
            return app;
        });
    }

    @Override
    public ApplicationStatusResponseDTO getApplicationStatus(String applicationNo) {
        String sql = """
                    SELECT
                        s.status_name,
                        s.description
                    FROM gsignip.applications a
                    JOIN gsignip.application_status s ON a.application_status_id = s.application_status_id
                    WHERE a.application_no = ?
                """;

        return jdbcTemplate.queryForObject(sql, new Object[] { applicationNo }, (rs, rowNum) -> {
            ApplicationStatusResponseDTO app = new ApplicationStatusResponseDTO();
            app.setStatusName(rs.getString("status_name"));
            app.setDescription(rs.getString("description"));
            return app;
        });
    }

    @Override
    public void cancelApplication(String applicationNo) {
        String sql = """
                    UPDATE gsignip.applications
                    SET application_status_id = 7
                    WHERE application_no = ?
                """;

        jdbcTemplate.update(sql,
                applicationNo);
    }

    @Override
    public boolean existsByApplicationNo(String applicationNo) {
        String sql = "SELECT EXISTS (SELECT 1 FROM gsignip.applications WHERE application_no = ?)";
        return jdbcTemplate.queryForObject(sql, Boolean.class, applicationNo);
    }

    @Override
    public void modifyApplicationStatus(String applicationNo, int applicationStatus) {
        String sql = "UPDATE gsignip.applications SET application_status_id = ? WHERE application_no = ?";

        jdbcTemplate.update(sql, applicationStatus, applicationNo);
    }

    @Override
    public ApplicationFilterResponseDTO filterApplications(ApplicationFilterRequestDTO filterRequest) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();

        // Base query
        sql.append("""
                    SELECT a.application_no,
                           CONCAT(u.first_name, ' ', u.last_name) AS applicant_name,
                           a.title_of_invention,
                           DATE(a.created_at) AS application_date,
                           s.application_status_id
                    FROM gsignip.applications a
                    LEFT JOIN gsignip.application_status s ON a.application_status_id = s.application_status_id
                    LEFT JOIN gsignip.users u ON a.user_id = u.user_id
                    WHERE 1=1
                """);

        // Add filters
        if (filterRequest.getApplicationStatus() != null) {
            sql.append(" AND a.application_status_id = ?");
            params.add(filterRequest.getApplicationStatus());
        }

        if (filterRequest.getApplicantName() != null && !filterRequest.getApplicantName().trim().isEmpty()) {
            sql.append(" AND (CONCAT(u.first_name, ' ', u.last_name) ILIKE ? OR a.title_of_invention ILIKE ?)");
            String searchTerm = "%" + filterRequest.getApplicantName().trim() + "%";
            params.add(searchTerm);
            params.add(searchTerm);
        }

        if (filterRequest.getApplicationNumber() != null && !filterRequest.getApplicationNumber().trim().isEmpty()) {
            sql.append(" AND a.application_no ILIKE ?");
            params.add("%" + filterRequest.getApplicationNumber().trim() + "%");
        }

        if (filterRequest.getStartDate() != null) {
            sql.append(" AND DATE(a.created_at) >= ?");
            params.add(filterRequest.getStartDate());
        }

        if (filterRequest.getEndDate() != null) {
            sql.append(" AND DATE(a.created_at) <= ?");
            params.add(filterRequest.getEndDate());
        }

        // Add ordering
        sql.append(" ORDER BY a.created_at DESC");

        // Execute query
        List<ApplicationFilterResponseDTO.FilteredApplicationDTO> applications = jdbcTemplate.query(
                sql.toString(),
                params.toArray(),
                (rs, rowNum) -> {
                    ApplicationFilterResponseDTO.FilteredApplicationDTO app = new ApplicationFilterResponseDTO.FilteredApplicationDTO();
                    app.setApplicationNumber(rs.getString("application_no"));
                    app.setApplicantName(rs.getString("applicant_name"));
                    app.setTitle(rs.getString("title_of_invention"));
                    app.setApplicationDate(rs.getObject("application_date", LocalDate.class));
                    app.setApplicationStatusId(rs.getInt("application_status_id"));
                    return app;
                });

        return new ApplicationFilterResponseDTO(applications);
    }

    private void insertDocument(String applicationNo, ApplicationDocument doc) {
        String deleteSql = """
                    DELETE FROM gsignip.application_documents
                    WHERE application_no = ? AND application_document_type_id = ?
                """;

        String insertSql = """
                    INSERT INTO gsignip.application_documents (
                        application_no,
                        application_document_type_id,
                        file_name,
                        file_extension,
                        file
                    ) VALUES (?, ?, ?, ?, ?)
                """;

        // Delete old version
        jdbcTemplate.update(deleteSql, applicationNo, doc.getApplicationDocumentTypeId());

        // Insert new version
        jdbcTemplate.update(insertSql,
                applicationNo,
                doc.getApplicationDocumentTypeId(),
                doc.getFileName(),
                doc.getFileExtension(),
                doc.getFile());
    }

    @Override
    public int countApplicationsByStatusAndDateRange(int applicationStatusId, LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT COUNT(*)
                FROM gsignip.applications a
                WHERE a.application_status_id = ?
                AND DATE(a.created_at) >= ?
                AND DATE(a.created_at) <= ?
                """;

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, applicationStatusId, startDate, endDate);
            return count != null ? count : 0;
        } catch (EmptyResultDataAccessException e) {
            return 0;
        }
    }

    @Override
    public PatentSearchResponseDTO searchGrantedPatents(PatentSearchRequestDTO searchRequest) {
        try {
            // Base query for applications with granted status (assuming status_id = 4 is
            // granted)
            StringBuilder sql = new StringBuilder("""
                    SELECT
                        a.application_no as id,
                        a.application_no as patent_number,
                        a.title_of_invention as title,
                        CONCAT(u.first_name, ' ', u.last_name) as applicant,
                        CONCAT(u.first_name, ' ', u.last_name) as inventor,
                        c.country_name as country,
                        c.country_code as country_code,
                        DATE(a.created_at) as publication_date,
                        s.status_name as status,
                        pc.name as classification,
                        a.invention_summary as abstract_text,
                        '' as priority,
                        a.likelihood as likelihood
                    FROM gsignip.applications a
                    LEFT JOIN gsignip.users u ON a.user_id = u.user_id
                    LEFT JOIN gsignip.countries c ON a.country_id = c.country_id
                    LEFT JOIN gsignip.application_status s ON a.application_status_id = s.application_status_id
                    LEFT JOIN gsignip.patent_classifications pc ON pc.patent_classification_id = ANY(a.patent_classification_id)
                    WHERE a.application_status_id = 4
                    """);

            List<Object> params = new ArrayList<>();

            // Add search filters
            if ("basic".equals(searchRequest.getSearchType()) &&
                    searchRequest.getPatentNumber() != null && !searchRequest.getPatentNumber().trim().isEmpty()) {
                sql.append(" AND a.application_no ILIKE ?");
                params.add("%" + searchRequest.getPatentNumber().trim() + "%");
            }

            if ("advanced".equals(searchRequest.getSearchType())) {
                // Keyword search in title and abstract
                if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().trim().isEmpty()) {
                    sql.append(" AND (a.title_of_invention ILIKE ? OR a.invention_summary ILIKE ?)");
                    String keyword = "%" + searchRequest.getKeyword().trim() + "%";
                    params.add(keyword);
                    params.add(keyword);
                }

                // Title search
                if (searchRequest.getTitle() != null && !searchRequest.getTitle().trim().isEmpty()) {
                    sql.append(" AND a.title_of_invention ILIKE ?");
                    params.add("%" + searchRequest.getTitle().trim() + "%");
                }

                // Applicant/Inventor search
                if (searchRequest.getApplicantInventor() != null
                        && !searchRequest.getApplicantInventor().trim().isEmpty()) {
                    sql.append(" AND (u.first_name ILIKE ? OR u.last_name ILIKE ?)");
                    String applicant = "%" + searchRequest.getApplicantInventor().trim() + "%";
                    params.add(applicant);
                    params.add(applicant);
                }

                // Country search
                if (searchRequest.getCountryCode() != null && !searchRequest.getCountryCode().trim().isEmpty()) {
                    sql.append(" AND c.country_code = ?");
                    params.add(searchRequest.getCountryCode().trim());
                }

                // Classification search
                if (searchRequest.getPatentClassificationId() != null
                        && !searchRequest.getPatentClassificationId().trim().isEmpty()) {
                    sql.append(" AND ? = ANY(a.patent_classification_id)");
                    params.add(Integer.parseInt(searchRequest.getPatentClassificationId()));
                }

                // Date range search
                if (searchRequest.getPublicationStartDate() != null) {
                    sql.append(" AND DATE(a.created_at) >= ?");
                    params.add(searchRequest.getPublicationStartDate());
                }

                if (searchRequest.getPublicationEndDate() != null) {
                    sql.append(" AND DATE(a.created_at) <= ?");
                    params.add(searchRequest.getPublicationEndDate());
                }
            }

            // Count total records
            String countSql = "SELECT COUNT(*) FROM (" + sql.toString() + ") as count_query";
            Integer totalRecords = jdbcTemplate.queryForObject(countSql, Integer.class, params.toArray());
            if (totalRecords == null)
                totalRecords = 0;

            // Add pagination
            sql.append(" ORDER BY a.created_at DESC");
            sql.append(" LIMIT ? OFFSET ?");
            params.add(searchRequest.getSize());
            params.add((searchRequest.getPage() - 1) * searchRequest.getSize());

            // Execute query
            List<PatentSearchResponseDTO.PatentResultDTO> patents = jdbcTemplate.query(
                    sql.toString(),
                    params.toArray(),
                    (rs, rowNum) -> {
                        PatentSearchResponseDTO.PatentResultDTO patent = new PatentSearchResponseDTO.PatentResultDTO();
                        patent.setId(rs.getString("id"));
                        patent.setPatentNumber(rs.getString("patent_number"));
                        patent.setTitle(rs.getString("title"));
                        patent.setApplicant(rs.getString("applicant"));
                        patent.setInventor(rs.getString("inventor"));
                        patent.setCountry(rs.getString("country"));
                        patent.setCountryCode(rs.getString("country_code"));
                        patent.setPublicationDate(rs.getObject("publication_date", LocalDate.class));
                        patent.setStatus(rs.getString("status"));
                        patent.setClassification(rs.getString("classification"));
                        patent.setAbstractText(rs.getString("abstract_text"));
                        patent.setPriority(rs.getString("priority"));

                        BigDecimal likelihood = rs.getBigDecimal("likelihood");
                        patent.setLikelihood(likelihood != null ? likelihood.doubleValue() : null);

                        return patent;
                    });

            // Calculate pagination info
            int totalPages = (int) Math.ceil((double) totalRecords / searchRequest.getSize());

            return new PatentSearchResponseDTO(
                    totalRecords,
                    searchRequest.getPage(),
                    totalPages,
                    searchRequest.getSize(),
                    patents);
        } catch (Exception e) {
            // Return empty result in case of database error
            return new PatentSearchResponseDTO(0, 1, 0, searchRequest.getSize(), new ArrayList<>());
        }
    }
}
