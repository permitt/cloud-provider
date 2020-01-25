package beans;

public class Disk {
    private String ime;
    private String tip;
    private int kapacitet;
    private VM vm;

    public Disk(String ime, String tip, int kapacitet, VM vm) {
        this.ime = ime;
        this.tip = tip;
        this.kapacitet = kapacitet;
        this.vm = vm;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getTip() {
        return tip;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }

    public int getKapacitet() {
        return kapacitet;
    }

    public void setKapacitet(int kapacitet) {
        this.kapacitet = kapacitet;
    }

    public VM getVm() {
        return vm;
    }

    public void setVm(VM vm) {
        this.vm = vm;
    }
}
