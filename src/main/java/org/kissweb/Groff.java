package org.kissweb;

import java.io.*;

/**
 * Class to interface with the groff typesetting system.  This is an easy way to generate nicely formatted reports.
 * Of course, the underlying system must have groff/tbl/mm installed.
 *
 * See: https://www.gnu.org/software/groff
 *
 * @author Blake McBride
 *
 */
public class Groff {

    private final PrintWriter pw;
    private final String pdfname;
    private final String mmfname;
    private final boolean landscape;
    private String title;
    private boolean once = true;

    /**
     * Initialize a new report.  The files it uses are put in temporary files
     * that are auto-cleaned and in a place that can be served to the front-end.
     * On the front-end side, see JavaScript Utils.showReport()
     *
     * @param fnamePrefix file name prefix
     * @param title     report title
     * @param landscape true if landscape format
     * @throws IOException
     */
    public Groff(String fnamePrefix, String title, boolean landscape) throws IOException {
        File fyle = FileUtils.createTempFile(fnamePrefix, ".pdf");
        this.landscape = landscape;
        this.pdfname = fyle.getAbsolutePath();
        mmfname = pdfname.replaceAll("\\.pdf$", ".mm");
        pw = new PrintWriter(new BufferedWriter(new FileWriter(mmfname)));
        this.title = title;
    }

    private void writeHeader(String title) {
        pw.println(".PH \"''''\"");
        pw.println(".PF \"''Page \\\\\\\\nP''\"");

        pw.println(".de TP");
        pw.println("'SP .5i");
        pw.println("'tl '''Run date: " + DateTime.currentDateTimeFormatted());
        pw.println("'tl ''\\s(14" + title + "\\s0''");
        pw.println("'SP");
        pw.println("..");

        pw.println(".S 11");
        pw.println(".nf");
    }

    /**
     * Write a line to the groff input file.
     *
     * @param str
     */
    public void out(String str) {
        if (once) {
            writeHeader(title);
            once = false;
        }
        pw.println(str);
    }

    /**
     * Process the groff/tbl/mm input, produce the PDF output file, and return the path to the PDF file.
     *
     * @param sideMargin size of the margin on the left side of the page in inches
     * @return
     * @throws IOException
     * @throws InterruptedException
     */
    public String process(float sideMargin) throws IOException, InterruptedException {
        ProcessBuilder builder;
        if (once) {
            writeHeader(title);
            once = false;
        }
        pw.flush();
        pw.close();
        if (landscape)
            builder = new ProcessBuilder("groff", "-mm", "-t", "-Tpdf", "-P-pletter", "-rL=8.5i", "-P-l", "-rO="+sideMargin+"i", "-rW=" + (11-2*sideMargin) + "i", mmfname);
        else
            builder = new ProcessBuilder("groff", "-mm", "-t", "-Tpdf", "-P-pletter", "-rL=11i", "-rO="+sideMargin+"i", "-rW=" + (8.5-2*sideMargin) + "i", mmfname);
        builder.redirectOutput(new File(pdfname));
        Process p = builder.start();
        p.waitFor();
        (new File(mmfname)).delete();
        return FileUtils.getHTTPPath(pdfname);
    }

    /**
     * Process the groff/tbl/mm input, produce the PDF output file, and return the path to the PDF file.
     * Defaults to a 1 inch side margin.
     *
     * @return
     * @throws IOException
     * @throws InterruptedException
     */
    public String process() throws IOException, InterruptedException {
        return process(1f);
    }
}
