package beans;

import beans.VM;

public class Disk {
    private String ime;
    private String tip;
    private int kapacitet;
    private String organizacija;
    private String vm;

    @Override
    public boolean equals(Object obj) {
        Disk d = (Disk) obj;
        return this.getIme().equals(d.getIme());
    }

    public Disk(String ime, String tip, int kapacitet, String org, String vm) {
        this.ime = ime;
        this.tip = tip;
        this.kapacitet = kapacitet;
        this.organizacija = org;
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

    public String getVm() {
        return vm;
    }

    public void setVm(String vm) {
        this.vm = vm;
    }

    public String getOrganizacija() {
        return organizacija;
    }

    public void setOrganizacija(String org) {
        this.organizacija = org;
    }

}
