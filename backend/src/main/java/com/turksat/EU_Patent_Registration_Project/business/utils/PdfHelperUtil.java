package com.turksat.EU_Patent_Registration_Project.business.utils;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationStatusResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationSummaryResponseDTO;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfHelperUtil {

    public static byte[] generate(ApplicationSummaryResponseDTO dto, ApplicationStatusResponseDTO status) throws Exception {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.HELVETICA, 14, Font.BOLD);
        Font labelFont = new Font(Font.HELVETICA, 10, Font.BOLD);
        Font valueFont = new Font(Font.HELVETICA, 10);
        if (status.getStatusName().equalsIgnoreCase("Patent Granted") || status.getStatusName().equalsIgnoreCase("Rejected")) {
            //barcode
            String barcodeValue = dto.getNationalIdNo(); // or use ApplicationNo

            Barcode128 barcode = new Barcode128();
            barcode.setCode(barcodeValue);
            barcode.setCodeType(Barcode128.CODE128);

            PdfContentByte cb = writer.getDirectContent();
            Image barcodeImage = barcode.createImageWithBarcode(cb, null, null);
            barcodeImage.setAlignment(Image.ALIGN_RIGHT);
            barcodeImage.scalePercent(150);

            document.add(barcodeImage);
        }

        // Title
        Paragraph title = new Paragraph("Application Form", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph("\n"));


        PdfPTable table = new PdfPTable(2);
        table.setWidths(new float[]{1.5f, 3.5f}); // 1 part label, 4 parts value
        table.setWidthPercentage(90);

        addRow(table, "Full Name", ": " + dto.getFirstName() + " " + dto.getMiddleName() + " " + dto.getLastName(), labelFont, valueFont);
        addRow(table, "Birth Date", ": " + String.valueOf(dto.getBirthDate()), labelFont, valueFont);
        addRow(table, "Country", ": " + dto.getCountryName(), labelFont, valueFont);
        addRow(table, "National ID", ": " + dto.getNationalIdNo(), labelFont, valueFont);
        addRow(table, "Gender", ": " + dto.getGenderName(), labelFont, valueFont);
        addRow(table, "Entitlement Rate", ": " + String.valueOf(dto.getApplicantEntitlementRate()), labelFont, valueFont);
        addRow(table, "Email", ": " + dto.getEmail(), labelFont, valueFont);
        addRow(table, "Phone", ": " + dto.getPhoneNumber(), labelFont, valueFont);
        addRow(table, "Residency Type", ": " + dto.getResidencyTypeName(), labelFont, valueFont);
        addRow(table, "State", ": " + dto.getStateName(), labelFont, valueFont);
        addRow(table, "Residence Country", ": " + dto.getCountryOfResidence(), labelFont, valueFont);
        addRow(table, "City", ": " + dto.getCity(), labelFont, valueFont);

        addRow(table, "CI Country", ": " + dto.getCiCountryName(), labelFont, valueFont);
        addRow(table, "CI Street 1", ": " + dto.getCiStreetAddressOne(), labelFont, valueFont);
        addRow(table, "CI Street 2", ": " + dto.getCiStreetAddressTwo(), labelFont, valueFont);
        addRow(table, "CI City", ": " + dto.getCiCity(), labelFont, valueFont);
        addRow(table, "CI Postal Code", ": " + dto.getCiPostalCode(), labelFont, valueFont);

        addRow(table, "Anonymous", ": " + String.valueOf(dto.isAnonymous()), labelFont, valueFont);
        addRow(table, "Application Type", ": " + dto.getApplicationTypeName(), labelFont, valueFont);
        addRow(table, "Title of Invention", ": " + dto.getTitleOfInvention(), labelFont, valueFont);
        addRow(table, "Invention Summary", ": " + dto.getInventionSummary(), labelFont, valueFont);

        // Classification names
        List<String> classNames = dto.getClassificationNames();
        if (classNames != null && !classNames.isEmpty()) {
            addRow(table, "Classifications", ": " + String.join(",\n ", classNames), labelFont, valueFont);
        }

        addRow(table, "Geographical Origin", ": " + String.valueOf(dto.isGeographicalOrigin()), labelFont, valueFont);
        addRow(table, "Government Funded", ": " + String.valueOf(dto.isGovernmentFunded()), labelFont, valueFont);
        addRow(table, "AIA", ": " + String.valueOf(dto.isAIA()), labelFont, valueFont);

        // Add table to doc
        document.add(table);

        // Determine status color
        String statusText = status.getStatusName();
        Color bgColor = Color.GRAY;
        if (statusText.equals("Patent Granted") || statusText.equals("Completed")) {
            bgColor = new Color(0, 153, 0);
        } else if (statusText.equals("Rejected") || statusText.equals("Cancelled")) {
            bgColor = new Color(204, 0, 0);
        }

        // ✔ Fancy STATUS box only
        PdfPTable statusBox = new PdfPTable(1);
        statusBox.setWidthPercentage(100);
        statusBox.setSpacingBefore(20f);

        Font statusFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);

        PdfPCell statusCell = new PdfPCell(new Phrase(statusText, statusFont));
        statusCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        statusCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        statusCell.setBackgroundColor(bgColor);
        statusCell.setBorder(Rectangle.BOX);
        statusCell.setBorderColor(bgColor);
        statusCell.setPadding(12f);
        statusCell.setFixedHeight(40f);

        statusBox.addCell(statusCell);
        document.add(statusBox);


        // 📝 Description paragraph (separate from status)
        Font descriptionFont = new Font(Font.HELVETICA, 10);
        Paragraph desc = new Paragraph(status.getDescription(), descriptionFont);
        desc.setSpacingBefore(12f);
        desc.setSpacingAfter(5f);
        desc.setAlignment(Element.ALIGN_LEFT);

        document.add(desc);


        document.close();
        return out.toByteArray();
    }

    private static void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setPadding(6);
        labelCell.setBorderWidth(0);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "-", valueFont));
        valueCell.setPadding(6);
        valueCell.setBorderWidth(0);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}

